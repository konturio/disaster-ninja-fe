import { noop } from '@reatom/core-v2';
import { userStateAtom } from '~core/auth/atoms/userState';
import type { ApiClient } from '~core/api_client';

interface AuthClientConfig {
  apiClient: ApiClient;
}
export type AuthLoginHook = () => Promise<unknown>;

export type AuthLogoutHook = (...args: unknown[]) => unknown;

export class AuthClient {
  private static instance: AuthClient;

  private readonly _apiClient: ApiClient;

  loginHook: AuthLoginHook = noop;
  logoutHook: AuthLogoutHook = noop;
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

  public logout() {
    this._apiClient.logout();
    this.logoutHook();
    userStateAtom.logout.dispatch();
    // reload to init with public config and profile
    location.reload();
  }
  private startAuthenticated() {
    this.loginHook();
    userStateAtom.authorize.dispatch();
  }

  /**
   * refreshAuth
   * @returns void
   *
   * @throws {ApiClientError}
   */
  public async refreshAuth() {
    await this._apiClient.refreshAuthToken();
  }

  /**
   * @returns true or error message
   */
  public async authenticate(user: string, password: string) {
    try {
      const loginOk = await this._apiClient.login(user, password);
      if (loginOk) {
        // reload to init with authenticated config and profile
        location.reload();
      }
      return true;
    } catch (e: any) {
      return e?.message || 'Login error';
    }
  }

  public checkAuth() {
    if (this._apiClient.checkLocalAuthToken()) {
      // auth init flow
      this.startAuthenticated();
      return true;
    }
    // anon init flow
    this.startAnonymosly();
    return false;
  }

  startAnonymosly() {
    this.loginHook();
  }
}
