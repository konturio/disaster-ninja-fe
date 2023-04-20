import 'vi-fetch/setup';
import './_configMock';
import { mockGet, mockPost } from 'vi-fetch';
import { ApiClient } from '../apiClient';
import { base64UrlDecode, base64UrlEncode } from './_tokenUtils';
import { createNotificationServiceMock } from './_servicesMocks';

const mockAdapter = {
  onGet: mockGet,
  onPost: mockPost,
};
export function setTimeOffset(timeOffsetMin: number): number {
  return (new Date().getTime() + timeOffsetMin * 60 * 1000) / 1000;
}

export function setTokenExp(token: string, time: number): string {
  const tokenSplitted = token.split('.');
  const midToken = JSON.parse(base64UrlDecode(tokenSplitted[1]));
  midToken.exp = time;
  tokenSplitted[1] = base64UrlEncode(JSON.stringify(midToken));
  return tokenSplitted.join('.');
}

export const createLocalStorageMock = () => ({
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => null,
  removeItem: (key: string) => null,
  clear: () => null,
  key: (idx: number) => null,
  length: 0,
});

let n = 0;
export const createContext = () => {
  const instanceId = `Instance ${n++}`;
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjk3MTA2NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.0GUrGfXYioalJVDRfWgWfx3oQRwk9FsOeAvULj-3ins';
  const expiredToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjAyNDk4NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.tIETTaRaiJYto0Wb4oPbfCJHUGGjw9--mTfXVWWsVMk';
  const actualToken = setTokenExp(expiredToken, setTimeOffset(10));
  const refreshToken = 'testRefreshToken';
  const username = 'testuser';
  const password = 'testpassword';

  const localStorageMock = createLocalStorageMock();
  ApiClient.init({
    notificationService: createNotificationServiceMock(),
    loginApiPath: '/login',
    refreshTokenApiPath: '/refresh',
    baseURL: 'https://localhost/api',
    instanceId,
    storage: localStorageMock,
  });

  const apiClient = ApiClient.getInstance(instanceId);

  // setup token expiration time
  (apiClient as any).token = token;
  (apiClient as any).tokenExpirationDate = new Date(
    new Date().getTime() + 1000 * 60 * 30,
  );

  return {
    apiClient,
    loginFunc: async () => await apiClient.login(username, password),
    token: actualToken,
    expiredToken: expiredToken,
    refreshToken: refreshToken,
    username,
    password,
    localStorageMock,
    mockAdapter,
  };
};

type ExTestContext = ReturnType<typeof createContext>;
declare module 'vitest' {
  export interface TestContext {
    ctx: ExTestContext;
  }
}
