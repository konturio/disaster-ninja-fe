export interface AuthConfig {
  baseUrl?: string;
  realm?: string;
  clientId?: string;
  username?: string;
  password?: string;
}

export class AuthFactory {
  static createConfig(overrides: Partial<AuthConfig> = {}): Required<AuthConfig> {
    return {
      baseUrl: 'http://localhost:8080/auth',
      realm: 'test-realm',
      clientId: 'test-client',
      username: 'test-user',
      password: 'test-password',
      ...overrides,
    };
  }

  static getTokenEndpoint(config: AuthConfig): string {
    const { baseUrl, realm } = this.createConfig(config);
    return `${baseUrl}/realms/${realm}/protocol/openid-connect/token`;
  }

  static getApiUrl(path: string = ''): string {
    return `http://localhost:8080/api${path}`;
  }
}
