import { ApiClient } from '~core/api_client';
import { UserDataModel } from '~core/auth/models/UserDataModel';
import { userResourceAtom } from '~core/auth/atoms/UserResourceAtom';

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

  public async authenticate(): void {
    userResourceAtom.subscribe(() => {/*empty*/});
  }
}
