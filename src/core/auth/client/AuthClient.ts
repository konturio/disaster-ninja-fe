import { currentUserAtom } from '~core/shared_state';
import appConfig from '~core/app_config';
import { userStateAtom } from '~core/auth/atoms/userState';
import { yandexMetrics } from '~core/metrics';
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
      appConfig.intercom.name = window.konturAppConfig.INTERCOM_DEFAULT_NAME;
      appConfig.intercom['email'] = null;
      window['Intercom']('update', {
        name: appConfig.intercom.name,
        email: appConfig.intercom['email'],
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
    let profileUserdata: unknown;
    try {
      profileUserdata = await this._apiClient.get('/users/current_user', {}, true);
    } catch (error) {
      console.error('error while gathering /users/current_user', error);
      return 'error while proccessing';
    }
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
    appConfig.intercom.name = response.jwtData.preferred_username;
    appConfig.intercom['email'] = response.jwtData.email;
    yandexMetrics.mark('setUserID', response.jwtData.email);
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
        const res = await this.processAuthResponse(response);
        if (res === 'error while proccessing') throw 'could not fetch user data';
      }
    } catch (e) {
      console.warn('Auth has been expired');
      this.logout();
    }
  }
}
