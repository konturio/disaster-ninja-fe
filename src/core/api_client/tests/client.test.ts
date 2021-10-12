import MockAdapter from 'axios-mock-adapter';
import { ApiClient, INotificationService, ITranslationService } from '../ApiClient';
import { AxiosRequestConfig } from 'axios';
import { NotificationMessage } from '~core/types/notification';
import { AuthResponseData } from '~core/api_client/ApiTypes';

describe('Disaster Ninja Api Client', () => {
  const notificationService: INotificationService = {
    error: (message: NotificationMessage) => {
      console.log(`message: ${message}`);
    }
  };

  const translationService: ITranslationService = {
    t: (message: string) => {
      console.log(`translate: ${message}`);
      return message;
    }
  };

  const baseURL = 'https://localhost/api';
  const loginApiPath = '/login';
  const timeout = 3000;
  const username = 'testuser';
  const password = 'testpassword';
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjM0MDM0NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.LrFmapQso9hgunwitYvaMnTn4EtXKWeJuk-ANKfiGrE';

  describe('initialization', () => {
    test('has to be initialized first', () => {
      expect(ApiClient.getInstance).toThrow('You have to initialize api client first!');
    })

    test('can be initialized with config object', () => {
      ApiClient.init({ notificationService, translationService, loginApiPath, baseURL, timeout })
      expect(ApiClient.getInstance()).toBeTruthy();
    })
  });

  describe('authorization', () => {
    let apiClient: ApiClient;
    let mockAdapter: MockAdapter;

    beforeEach(() => {
      ApiClient.init({ notificationService, translationService, loginApiPath, baseURL, timeout })
      apiClient = ApiClient.getInstance();
      mockAdapter = new MockAdapter(apiClient.apiSauceInstance.axiosInstance);
    });

    test('can login with username and password', async () => {
      const mockResponse = { accessToken: token, refreshToken: token };
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [200, mockResponse]);
      mockAdapter.onPost('login').reply((config: AxiosRequestConfig) => mockHandler(config));

      const res = (await apiClient.login(username, password)) as { kind: 'ok'; data?: AuthResponseData; };
      expect(res.kind).toBe('ok');
      expect(res.data).not.toBeUndefined();
      expect(res).toHaveProperty('data.accessToken');
      expect(res).toHaveProperty('data.refreshToken');
      expect(res.data?.accessToken).toBe(token);
      expect(res.data?.refreshToken).toBe(token) ;
    });

    test('login with 404 error', async () => {
      const mockHandler = jest.fn((config: AxiosRequestConfig) => [404]);
      mockAdapter.onPost('login').reply((config: AxiosRequestConfig) => mockHandler(config));

      const res = (await apiClient.login(username, password)) as { kind: 'ok'; data?: unknown; };
      console.log('login result: ', res);
    });
  });
});
