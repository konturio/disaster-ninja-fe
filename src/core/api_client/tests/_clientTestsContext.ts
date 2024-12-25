/* eslint-disable import/order */
import fetchMock from '@fetch-mock/vitest';
import { LocalStorageMock } from './_localStorageMock';
import { OidcSimpleClient } from '../../auth/OidcSimpleClient';
import { ApiClient } from '../apiClient';

export interface TestContext {
  baseUrl: string;
  keycloakRealm: string;
  username: string;
  password: string;
  token: string;
  expiredToken: string;
  refreshToken: string;
  authClient: OidcSimpleClient;
  apiClient: ApiClient;
  localStorageMock: LocalStorageMock;
  fetchMock: typeof fetchMock;
  loginFunc: () => Promise<any>;
}

export function createContext(): TestContext {
  const baseUrl = 'http://localhost:8080/auth';
  const keycloakRealm = 'test-realm';
  const username = 'test-user';
  const password = 'test-password';
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTcwMDAwMDAwMH0.JDdqWq4ClLhHhg4Z7sBpQ7gk8lQ7FK7wvZhfV9v9w_k';
  const expiredToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDAwMDAwMDAsImlhdCI6MTYwMDAwMDAwMH0.JDdqWq4ClLhHhg4Z7sBpQ7gk8lQ7FK7wvZhfV9v9w_k';
  const refreshToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTksImlhdCI6MTcwMDAwMDAwMH0.JDdqWq4ClLhHhg4Z7sBpQ7gk8lQ7FK7wvZhfV9v9w_k';

  const localStorageMock = new LocalStorageMock();

  const authClient = new OidcSimpleClient(localStorageMock);
  authClient.init(`${baseUrl}/realms/${keycloakRealm}`, 'test-client');

  const apiClient = new ApiClient({});
  apiClient.init({ baseUrl: 'http://localhost:8080/api' });
  apiClient.authService = authClient;

  // Reset fetch mock before configuring new mocks
  fetchMock.mockReset();

  // Configure fetch mock to match form URL encoded requests
  const tokenEndpoint = `${baseUrl}/realms/${keycloakRealm}/protocol/openid-connect/token`;

  // Enable fetch mocking
  fetchMock.mockGlobal();

  // Mock for successful login with correct credentials
  fetchMock.postOnce(tokenEndpoint, (url: string, opts: any) => ({
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      access_token: token,
      refresh_token: refreshToken,
    },
  }));

  // Default mock for failed login
  fetchMock.post(tokenEndpoint, {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
    body: {
      error: 'invalid_grant',
      error_description: 'Invalid username or password',
    },
  });

  // Mock for test endpoint
  fetchMock.post('http://localhost:8080/api/test', {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {},
  });

  return {
    baseUrl,
    keycloakRealm,
    username,
    password,
    token,
    expiredToken,
    refreshToken,
    authClient,
    apiClient,
    localStorageMock,
    fetchMock,
    loginFunc: () => authClient.login(username, password),
  };
}

export function setTimeOffset(offset: number): void {
  const now = Date.now();
  Date.now = () => now + offset;
}

export function setTokenExp(token: string, exp: number): string {
  const parts = token.split('.');
  const payload = JSON.parse(atob(parts[1]));
  payload.exp = exp;
  parts[1] = btoa(JSON.stringify(payload));
  return parts.join('.');
}
