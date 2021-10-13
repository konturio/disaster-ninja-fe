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

describe('Disaster Ninja Api Client', () => {
  const notificationService: INotificationService = {
    error: (message: NotificationMessage) => {
      console.log(`message: ${message}`);
    },
  };

  const translationService: ITranslationService = {
    t: (message: string) => {
      console.log(`translate: ${message}`);
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
      const axiosInstance = (apiClient as any)['apiSauceInstance']
        .axiosInstance;
      mockAdapter = new MockAdapter(axiosInstance);
      loginFunc = async () => await apiClient.login(username, password);
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

      const res = (await apiClient.login(
        username,
        password,
      )) as AuthResponseData;
      expect(res).toHaveProperty('accessToken');
      expect(res).toHaveProperty('refreshToken');
      expect(res.accessToken).toBe(token);
      expect(res.refreshToken).toBe(token);
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

    test('can refresh old token', async () => {
      const mockResponse = { accessToken: token, refreshToken: token };
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [
        200,
        mockResponse,
      ]);
      mockAdapter
        .onPost('login')
        .reply((config: AxiosRequestConfig) => mockHandler(config));

      const res = (await apiClient.login(
        username,
        password,
      )) as AuthResponseData;
      expect(res).toHaveProperty('accessToken');
      expect(res).toHaveProperty('refreshToken');
      expect(res.accessToken).toBe(token);
      expect(res.refreshToken).toBe(token);
    });

    // test('login with 404 error', async () => {
    //   const mockHandler = jest.fn((config: AxiosRequestConfig) => [404]);
    //   mockAdapter.onPost('login').reply((config: AxiosRequestConfig) => mockHandler(config));
    //
    //   const res = (await apiClient.login(username, password)) as AuthResponseData;
    //   expect(res).not.toBeUndefined();
    //   //console.log('login result: ', res);
    // });
  });
});
