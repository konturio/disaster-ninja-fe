import { ApiClient } from '~core/api_client';
import { currentUserAtom } from '~core/auth';
import { callYm } from '~utils/stats/yandexCounter';

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

<<<<<<< Updated upstream
  public async authenticate(user: string, password: string): Promise<true | string | undefined> {
=======
  public logout() {
    this._apiClient.logout();
    currentUserAtom.setUser.dispatch();
    userStateAtom.logout.dispatch();
  }

  private onTokenExpired() {
    console.error('Auth Problem! Token is expired.');
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
    window['Intercom']('update', {
      name: response.jwtData.preferred_username,
      email: response.jwtData.email,
    });
    callYm('setUserID', response.jwtData.email);
    callYm('userParams', { status: 'registered', UserID: response.jwtData.email });
  }

  public async authenticate(
    user: string,
    password: string,
  ): Promise<true | string | undefined> {
>>>>>>> Stashed changes
    const response = await this._apiClient.login(user, password);
    if (response && typeof response === 'object' && 'token' in response) {
      currentUserAtom.setUser.dispatch({
        username: response.jwtData.preferred_username,
        token: response.token,
        email: response.jwtData.email,
        firstName: response.jwtData.given_name,
        lastName: response.jwtData.family_name
      });
      window['Intercom']('update', { name: response.jwtData.preferred_username, email: response.jwtData.email });
      callYm('setUserID', response.jwtData.email);
      return true;
    }
    return response;
  }
}
