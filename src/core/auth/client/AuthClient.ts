import { ApiClient } from '~core/api_client';
import config from '~core/app_config';

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

  public async authenticate(user: string, password: string) {
    const params = new URLSearchParams();
    params.append('username', user);
    params.append('password', password);
    params.append('client_id', config.keycloakClientId);
    params.append('grant_type', 'password');
    const response = this._apiClient.post(`auth/realms/${config.keycloakRealm}/protocol/openid-connect/token`,
      params,
      false,
      { headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }});
    console.log('auth: ', response);
    return response;
  }
}
