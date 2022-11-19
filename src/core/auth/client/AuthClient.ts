import { currentUserAtom } from '~core/shared_state';
import { callYm } from '~utils/metrics/yandexCounter';
import core from '~core/index';
import { userStateAtom } from '~core/auth/atoms/userState';
import type { JWTData } from '~core/api_client/types';
import type { ApiClient } from '~core/api_client';

interface AuthClientConfig {
  apiClient: ApiClient;
}

export class AuthClient {
  private static instance: AuthClient;

  private readonly _apiClient: ApiClient;

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
    currentUserAtom.setUser.dispatch();
    userStateAtom.logout.dispatch();

    if (window['Intercom']) {
      core.config.intercom.name = window.konturAppConfig.INTERCOM_DEFAULT_NAME;
      core.config.intercom['email'] = null;
      window['Intercom']('update', {
        name: core.config.intercom.name,
        email: core.config.intercom['email'],
      });
    }
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
    // const profile = await this._apiClient.get<profileResponse>(
    const profileUserdata = await this._apiClient.get('/users/current_user', {}, true);
    const jwtUserdata = {
      username: response.jwtData.preferred_username,
      token: response.token,
      email: response.jwtData.email,
      firstName: response.jwtData.given_name,
      lastName: response.jwtData.family_name,
    };
    // @ts-expect-error - Fix me - load profile in better place
    const mergedUserdata = { ...jwtUserdata, ...profileUserdata };
    currentUserAtom.setUser.dispatch(mergedUserdata);
    userStateAtom.authorize.dispatch();
    // now when intercom is a feature it can be saved in window after this check happens
    if (window['Intercom']) {
      window['Intercom']('update', {
        name: response.jwtData.preferred_username,
        email: response.jwtData.email,
      });
    }
    // in case we do have intercom - lets store right credentials for when it will be ready
    core.config.intercom.name = response.jwtData.preferred_username;
    core.config.intercom['email'] = response.jwtData.email;
    callYm('setUserID', response.jwtData.email);
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

  public async checkAuth(): Promise<void> {
    try {
      const response = await this._apiClient.checkAuth(this.onTokenExpired);
      if (response && typeof response === 'object' && 'token' in response) {
        this.processAuthResponse(response);
      }
    } catch (e) {
      console.warn('Auth has been expired');
      this.logout();
    }
  }
}
