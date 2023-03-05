// import { noop } from '@reatom/core-v2';
import { userStateAtom } from '~core/auth/atoms/userState';
import type { JWTData, LocalAuthToken } from '~core/api_client/types';
import type { ApiClient } from '~core/api_client';

interface AuthClientConfig {
  apiClient: ApiClient;
}
export type AuthLoginHook = (
  // response field provided if authenticated
  response?: AuthSuccessResponse,
) => Promise<unknown>;

export type AuthLogoutHook = (...args: unknown[]) => unknown;

export type AuthSuccessResponse = {
  token: string;
  refreshToken: string;
  jwtData: JWTData;
};

export class AuthClient {
  private static instance: AuthClient;

  private readonly _apiClient: ApiClient;

  loginHook: AuthLoginHook = async () => {
    /* noop */
  };
  logoutHook: AuthLogoutHook = () => {
    /* noop */
  };
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
    this.logoutHook();
    userStateAtom.logout.dispatch();
    // reload to init with public config and profile
    location.reload();
  }

  private onTokenExpired() {
    console.warn('User session has been expired. Logging out.');
    this.logout();
  }

  private startAuthenticated(response: AuthSuccessResponse) {
    this.loginHook(response);
    userStateAtom.authorize.dispatch();
  }

  public async authenticate(
    user: string,
    password: string,
  ): Promise<true | string | undefined> {
    const response = await this._apiClient.login(user, password);
    if (response && typeof response === 'object' && 'token' in response) {
      // reload to init with authenticated config and profile
      location.reload();
      return true;
    }
    return response;
  }

  public checkAuth() {
    const response = this.checkLocalAuthToken();
    if (response?.token) {
      // auth init flow
      this.startAuthenticated(response);
      return true;
    }
    // anon init flow
    this.startAnonymosly();
    return false;
  }

  startAnonymosly() {
    this.loginHook();
  }

  public checkLocalAuthToken(): LocalAuthToken | undefined {
    try {
      const response = this._apiClient.getLocalAuthToken(() => this.onTokenExpired());
      return response;
    } catch (e) {
      console.warn('Auth has been expired', e);
      this.logout();
    }
  }
}
