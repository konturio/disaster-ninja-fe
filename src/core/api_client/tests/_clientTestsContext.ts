import 'vi-fetch/setup';
import { mockFetch, mockGet, mockPost } from 'vi-fetch';
import { ApiClient } from '../apiClient';
import { base64UrlDecode, base64UrlEncode } from './_tokenUtils';

const baseUrl = 'https://localhost/api';
mockFetch.setOptions({ baseUrl });
const mockAdapter = {
  onGet: mockGet,
  onPost: mockPost,
  mockFetch,
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

export const createContext = () => {
  const token =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjk3MTA2NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.0GUrGfXYioalJVDRfWgWfx3oQRwk9FsOeAvULj-3ins';
  const expiredToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiYWRtaW4iLCJVc2VybmFtZSI6InRlc3R1c2VyIiwiZXhwIjoxNjAyNDk4NDM0LCJpYXQiOjE2MzQwMzQ0MzR9.tIETTaRaiJYto0Wb4oPbfCJHUGGjw9--mTfXVWWsVMk';
  const actualToken = setTokenExp(expiredToken, setTimeOffset(10));
  const refreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIyMGJjYzUzNy00MzRkLTQzMjItYTk2YS1hMjNlZDc0N2JhYjAi.ewogICJleHAiOiAxNzIwMDA0OTc0LAogICJpYXQiOiAxNzIwMDA0Njc0Cn0.RVI1MwYAh4Wle8vQeyRUYPy1id3wQWeXY0_M4jQ7ZV0'; //fake token
  const username = 'testuser';
  const password = 'testpassword';

  const localStorageMock = createLocalStorageMock();

  const apiClient = new ApiClient({
    storage: localStorageMock,
  });

  const keycloakRealm = 'keycloak_mock_realm';
  apiClient.setup({
    baseUrl,
    keycloakClientId: 'keycloak_mock_id',
    keycloakRealm,
    keycloakUrl: baseUrl,
  });

  (apiClient as any).token = token;
  (apiClient as any).tokenExpirationDate = new Date(
    new Date().getTime() + 1000 * 60 * 30,
  );
  (apiClient as any).refreshToken = refreshToken;
  (apiClient as any).refreshTokenExpirationDate = new Date(
    new Date().getTime() + 1000 * 60 * 60 * 24 * 30,
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
    keycloakRealm,
  };
};

type ExTestContext = ReturnType<typeof createContext>;
declare module 'vitest' {
  export interface TestContext {
    ctx: ExTestContext;
  }
}
