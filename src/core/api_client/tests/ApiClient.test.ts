import MockAdapter from 'axios-mock-adapter';
import {
  ApiClient,
  INotificationService,
  ITranslationService,
} from '../ApiClient';
import { AxiosRequestConfig } from 'axios';
import { NotificationMessage } from '~core/types/notification';
import { AuthResponseData } from '~core/api_client/ApiTypes';
import { ApiClientError } from '../ApiProblem';
import { base64UrlDecode, base64UrlEncode } from './TokenUtils';

describe('Disaster Ninja Api Client', () => {
  const notificationService: INotificationService = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: (message: NotificationMessage) => {},
  };

  const translationService: ITranslationService = {
    t: (message: string) => {
      return message;
    },
  };

  const baseURL = 'https://localhost/api';
  const loginApiPath = '/login';
  const refreshTokenApiPath = '/refresh';
  const timeout = 3000;
  const username = 'testuser';
  const password = 'testpassword';
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjk3MTA2NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.0GUrGfXYioalJVDRfWgWfx3oQRwk9FsOeAvULj-3ins';
  const expiredToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjAyNDk4NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.tIETTaRaiJYto0Wb4oPbfCJHUGGjw9--mTfXVWWsVMk';

  describe('initialization', () => {
    test('has to be initialized first', () => {
      expect(ApiClient.getInstance).toThrow(Error);
      expect(ApiClient.getInstance).toThrow(
        'You have to initialize api client first!',
      );
    });

    test('can be initialized with config object', () => {
      ApiClient.init({
        notificationService,
        translationService,
        loginApiPath,
        baseURL,
        timeout,
      });
      expect(ApiClient.getInstance()).toBeTruthy();
    });
  });

  describe('authorization', () => {
    let apiClient: ApiClient;
    let mockAdapter: MockAdapter;
    let loginFunc: (username: string, password: string) => void;

    beforeEach(() => {
      ApiClient.init({
        notificationService,
        translationService,
        loginApiPath,
        refreshTokenApiPath,
        baseURL,
        timeout,
      });
      apiClient = ApiClient.getInstance();
      // trick to get access to private var
      const axiosInstance = (apiClient as any).apiSauceInstance.axiosInstance;
      mockAdapter = new MockAdapter(axiosInstance);
      loginFunc = async () => await apiClient.login(username, password);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('can login with username and password', async () => {
      const mockResponse = { accessToken: token, refreshToken: token };
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [
        200,
        mockResponse,
      ]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      // mock localstorage setItem
      const setItemFn = jest.fn((key: unknown, value: unknown) => {
        expect(value).toEqual(JSON.stringify({ token, refreshToken: token }));
      });
      jest
        .spyOn(window.localStorage.__proto__, 'setItem')
        .mockImplementationOnce(setItemFn);

      const res = (await apiClient.login(
        username,
        password,
      )) as AuthResponseData;
      expect(res).toHaveProperty('accessToken');
      expect(res).toHaveProperty('refreshToken');
      expect(res.accessToken).toBe(token);
      expect(res.refreshToken).toBe(token);
      expect(setItemFn).toHaveBeenCalledTimes(1);
    });

    test('invalid token error', async () => {
      const mockResponse = { accessToken: '123', refreshToken: '123' };
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [
        200,
        mockResponse,
      ]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      expect(loginFunc).rejects.toEqual(
        new ApiClientError("Can't decode token!", { kind: 'bad-data' }),
      );
    });

    test('expired token error', async () => {
      const mockResponse = {
        accessToken: expiredToken,
        refreshToken: expiredToken,
      };
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [
        200,
        mockResponse,
      ]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      expect(loginFunc).rejects.toEqual(
        new ApiClientError('Wrong token expire time!', { kind: 'bad-data' }),
      );
    });

    test('204 auth error', async () => {
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [204]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      expect(loginFunc).rejects.toEqual(
        new ApiClientError('No data received!', { kind: 'bad-data' }),
      );
    });

    test('no auth data error', async () => {
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [200]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      expect(loginFunc).rejects.toEqual(
        new ApiClientError('Wrong data received!', { kind: 'bad-data' }),
      );
    });

    test('refreshToken called when token is expired', async () => {
      expect.assertions(2);

      // set private field token with new token
      const apiClientObj = apiClient as any;
      apiClientObj.tokenWillExpire = new Date(
        new Date().getTime() + 1000 * 60 * 4,
      );
      // apiClientObj.token = newToken;

      //  mock refreshAuthToken
      const refreshFn = jest.fn();
      jest.spyOn(apiClient, 'refreshAuthToken').mockImplementation(refreshFn);
      expect(async () => await apiClient.get('/test')).rejects.toThrow(
        ApiClientError,
      );
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });

    test('login and refresh token', async () => {
      expect.assertions(6);

      const expirationTime = (new Date().getTime() + 1000 * 60 * 4) / 1000;

      // modify expired token to set expiration time in less than 5min (in 4min)
      const tokenSplitted = token.split('.');
      const midToken = JSON.parse(base64UrlDecode(tokenSplitted[1]));
      midToken.exp = expirationTime;
      tokenSplitted[1] = base64UrlEncode(JSON.stringify(midToken));
      const newToken = tokenSplitted.join('.');

      mockAdapter.onPost('login').reply((config: AxiosRequestConfig) => {
        expect(JSON.parse(config.data)).toEqual({ username, password });
        return [
          200,
          {
            accessToken: newToken,
            refreshToken: 'testrefresh',
          },
        ];
      });

      await apiClient.login(username, password);

      expect((apiClient as any).tokenWillExpire).toEqual(
        new Date(expirationTime * 1000),
      );
      expect((apiClient as any).token).toEqual(newToken);
      expect((apiClient as any).refreshToken).toEqual('testrefresh');

      //  mock refreshAuthToken
      const refreshFn = jest.fn();
      jest.spyOn(apiClient, 'refreshAuthToken').mockImplementation(refreshFn);
      expect(async () => await apiClient.get('/test')).rejects.toThrow(
        ApiClientError,
      );
      expect(refreshFn).toHaveBeenCalledTimes(1);
    });

    test('auth and call api with token', async () => {
      mockAdapter.onPost('login').reply((config: AxiosRequestConfig) => {
        expect(JSON.parse(config.data)).toEqual({ username, password });
        return [
          200,
          {
            accessToken: token,
            refreshToken: 'testrefresh',
          },
        ];
      });

      await apiClient.login(username, password);

      // call api with authorization
      mockAdapter.onGet('test2').reply((config: AxiosRequestConfig) => {
        expect(config.headers).toHaveProperty('Authorization');
        expect(config.headers.Authorization).toEqual(`Bearer ${token}`);
        return [200];
      });

      await apiClient.get('/test2');

      // call api without authorization
      mockAdapter.onPost('test3').reply((config: AxiosRequestConfig) => {
        expect(config.headers).not.toHaveProperty('Authorization');
        return [200];
      });

      await apiClient.post('/test3', { param1: 'test' }, false);
    });
  });

  describe('error handling', () => {
    let apiClient: ApiClient;
    let mockAdapter: MockAdapter;

    beforeEach(() => {
      ApiClient.init({
        notificationService,
        translationService,
        loginApiPath,
        refreshTokenApiPath,
        baseURL,
        timeout,
      });
      apiClient = ApiClient.getInstance();
      // trick to get access to private var
      const axiosInstance = (apiClient as any).apiSauceInstance.axiosInstance;
      mockAdapter = new MockAdapter(axiosInstance);

      // setup token expiration time
      (apiClient as any).token = token;
      (apiClient as any).tokenWillExpire = new Date(
        new Date().getTime() + 1000 * 60 * 30,
      );
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    test('401 error', async () => {
      mockAdapter.onGet('test401').reply((config: AxiosRequestConfig) => {
        return [401];
      });

      expect(apiClient.get('/test401')).rejects.toThrow(
        new ApiClientError('Not authorized or session has expired.', {
          kind: 'unauthorized',
          data: 'Not authorized or session has expired.',
        }),
      );
    });

    test('403 error', async () => {
      mockAdapter.onPost('test403').reply((config: AxiosRequestConfig) => {
        return [403];
      });

      expect(apiClient.post('/test403')).rejects.toThrow(
        new ApiClientError('Forbidden', { kind: 'forbidden' }),
      );
    });

    test('404 error', async () => {
      mockAdapter.onPut('test404').reply((config: AxiosRequestConfig) => {
        return [404];
      });

      expect(apiClient.put('/test404')).rejects.toThrow(
        new ApiClientError('Not found', { kind: 'not-found' }),
      );
    });

    test('timeout error', async () => {
      mockAdapter.onDelete('testTimeout').timeout();

      expect(apiClient.delete('/testTimeout')).rejects.toThrow(
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
      );
    });

    test('network error', async () => {
      mockAdapter.onDelete('testNetwork').networkError();

      expect(apiClient.delete('/testNetwork')).rejects.toThrow(
        new ApiClientError("Can't connect to server", {
          kind: 'cannot-connect',
          temporary: true,
        }),
      );
    });

    test('request abort error', async () => {
      expect.assertions(1);
      mockAdapter.onDelete('testAbort').abortRequest();

      expect(apiClient.delete('/testAbort')).rejects.toThrow(
        new ApiClientError('Request Timeout', {
          kind: 'timeout',
          temporary: true,
        }),
      );
    });

    test('500 error', async () => {
      mockAdapter.onGet('test500').reply((config: AxiosRequestConfig) => {
        return [500];
      });

      expect(apiClient.get('/test500')).rejects.toThrow(
        new ApiClientError('Unknown Error', {
          kind: 'unknown',
          temporary: true,
        }),
      );
    });
  });
});
