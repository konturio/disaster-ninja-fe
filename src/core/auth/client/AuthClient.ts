import { ApiClient } from '~core/api_client';
import { userStateAtom } from '~core/auth';
import { currentUserAtom } from '~core/shared_state';
import { JWTData } from '~core/api_client/ApiTypes';
import { callYm } from '~utils/stats/yandexCounter';

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
  }

  private onTokenExpired() {
    console.warn('User session has been expired. Logging out.');
    this.logout();
  }

  private processAuthResponse(response: {
    token: string;
    refreshToken: string;
    jwtData: JWTData;
  }) {
    currentUserAtom.setUser.dispatch({
      username: response.jwtData.preferred_username,
      token: response.token,
      email: response.jwtData.email,
      firstName: response.jwtData.given_name,
      lastName: response.jwtData.family_name,
    });
    userStateAtom.authorize.dispatch();
    if (window['Intercom']) {
      window['Intercom']('update', {
        name: response.jwtData.preferred_username,
        email: response.jwtData.email,
      });
    }
    callYm('setUserID', response.jwtData.email);
  }

  public async authenticate(
    user: string,
    password: string,
  ): Promise<true | string | undefined> {
    const response = await this._apiClient.login(user, password);
    if (response && typeof response === 'object' && 'token' in response) {
      this.processAuthResponse(response);
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
