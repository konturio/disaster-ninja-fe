import over from 'lodash/over';
import { userStateAtom } from '~core/auth/atoms/userState';
import type { JWTData } from '~core/api_client/types';
import type { ApiClient } from '~core/api_client';

interface AuthClientConfig {
  apiClient: ApiClient;
}
export type AuthPublicLoginHook = (apiClient: ApiClient) => Promise<unknown>;
export type AuthLoginHook = (
  apiClient: ApiClient,
  response: {
    token: string;
    refreshToken: string;
    jwtData: JWTData;
  },
) => Promise<unknown>;

export type AuthLogoutHook = (...args: unknown[]) => unknown;

export class AuthClient {
  private static instance: AuthClient;

  private readonly _apiClient: ApiClient;

  publicLoginHooks: AuthPublicLoginHook[] = [];
  loginHooks: AuthLoginHook[] = [];
  logoutHooks: AuthLogoutHook[] = [];
  private constructor({ apiClient }: AuthClientConfig) {
    this._apiClient = apiClient;
  }

  public static getInstance(): AuthClient {
    if (!AuthClient.instance) {
      throw new Error('You have to initialize auth client first!');
    } else {
      return AuthClient.instance;
    }
  }

  public static init(config: AuthClientConfig): AuthClient {
    if (AuthClient.instance) {
      throw new Error(`Auth client instance with had been already initialized`);
    }

    AuthClient.instance = new AuthClient(config);
    return AuthClient.instance;
  }

  public showLoginForm() {
    userStateAtom.login.dispatch();
  }

  public closeLoginForm() {
    userStateAtom.reset.dispatch();
  }

  public logout() {
    this._apiClient.logout();
    over(this.logoutHooks)();
    userStateAtom.logout.dispatch();
  }

  private onTokenExpired() {
    console.warn('User session has been expired. Logging out.');
    this.logout();
  }

  private async processAuthResponse(response: {
    token: string;
    refreshToken: string;
    jwtData: JWTData;
  }) {
    over(this.loginHooks)(this._apiClient, response);
    userStateAtom.authorize.dispatch();
  }

  public async authenticate(
    user: string,
    password: string,
  ): Promise<true | string | undefined> {
    const response = await this._apiClient.login(user, password);
    if (response && typeof response === 'object' && 'token' in response) {
      await this.processAuthResponse(response);
      return true;
    }
    return response;
  }

  public async checkAuth(): Promise<boolean> {
    try {
      const response = this._apiClient.getLocalAuthToken(this.onTokenExpired);
      if (response?.token) {
        this.processAuthResponse(response);
        return true;
      } else {
        this.publicLogin();
      }
    } catch (e) {
      console.warn('Auth has been expired');
      this.logout();
    }
    return false;
  }

  public async publicLogin() {
    over(this.publicLoginHooks)(this._apiClient);
  }
}
