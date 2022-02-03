import { ApiClient } from '~core/api_client';
import ym from 'react-yandex-metrika';
import { JWTData } from '~core/api_client/ApiTypes';
import { currentUserAtom } from '~core/shared_state';

interface AuthClientConfig {
   apiClient: ApiClient;
}

export class AuthClient {
  private static instance: AuthClient;

  private readonly _apiClient: ApiClient;

  private constructor({ apiClient}: AuthClientConfig) {
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
      throw new Error(
        `Auth client instance with had been already initialized`,
      );
    }

    AuthClient.instance = new AuthClient(config);
    return AuthClient.instance;
  }

  public showLoginForm() {
    currentUserAtom.login.dispatch();
  }

  public closeLoginForm() {
    currentUserAtom.reset.dispatch();
  }

  private onTokenExpired() {
    console.error('Auth Problem! Token is expired.')
  }

  private processAuthResponse(response: { token: string; refreshToken: string; jwtData: JWTData }) {
    console.log('processAuthResponse', response);
    currentUserAtom.setUser.dispatch({
      username: response.jwtData.preferred_username,
      token: response.token,
      email: response.jwtData.email,
      firstName: response.jwtData.given_name,
      lastName: response.jwtData.family_name
    });
    window['Intercom']('update', { name: response.jwtData.preferred_username, email: response.jwtData.email });
    ym('setUserID', response.jwtData.email);
  }

  public async authenticate(user: string, password: string): Promise<true | string | undefined> {
    const response = await this._apiClient.login(user, password);
    if (response && typeof response === 'object' && 'token' in response) {
      this.processAuthResponse(response);
      return true;
    }
    return response;
  }

  public async checkAuth(): Promise<void> {
    console.log('check auth');
    const response = await this._apiClient.checkAuth(this.onTokenExpired);
    if (response && typeof response === 'object' && 'token' in response) {
      this.processAuthResponse(response);
    }
  }

}
