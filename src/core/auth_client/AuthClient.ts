import { ApiClient } from '~core/api_client';
import { UserDataModel } from '~core/auth_client/userDataModel/UserDataModel';

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

  public async authenticate(): Promise<UserDataModel | null> {
    const userResponse = await this._apiClient.get( '/user', undefined, false);
    if (userResponse) {
      // map data to UserDataModel class
      const userData = new UserDataModel();
      Object.assign(userData, userResponse);
      return userData;
    }

    return null;
  }

}
