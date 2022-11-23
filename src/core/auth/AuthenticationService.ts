import { createUserAuthStateAtom } from './atoms/userAuthState';
import { UserStateStatus } from './constants';
import type { JWTData } from '~core/api_client/types';
import type { Intercom } from '~core/intercom/Intertcom';
import type {
  ApiService,
  AppMetricsI,
  AppStore,
  I18n,
  AppConfigParsedI,
} from '..';

export class AuthenticationService {
  public userStatus = UserStateStatus;
  private api: ApiService['apiClient'];
  private store: AppStore;
  private metrics: AppMetricsI;
  private intercom: Intercom;
  private config: AppConfigParsedI;
  atom: ReturnType<typeof createUserAuthStateAtom>;

  constructor({
    api,
    store,
    metrics,
    intercom,
    config,
  }: {
    api: ApiService;
    store: AppStore;
    metrics: AppMetricsI;
    intercom: Intercom;
    i18n: I18n;
    config: AppConfigParsedI;
  }) {
    this.config = config;
    this.api = api.apiClient;
    this.store = store;
    this.metrics = metrics;
    this.intercom = intercom;
    this.api.onTokenExpired(() => this.onTokenExpired());
    this.atom = createUserAuthStateAtom(store);
  }

  async init() {
    try {
      this.store.dispatch(this.atom.login());
      const response = await this.api.authenticate();
      if (response && typeof response === 'object' && 'token' in response) {
        this.postLogin(response);
      }
    } catch (e) {
      console.warn('Auth has been expired');
      this.logout();
    }
  }

  /* Switch user to public account */
  public async logout() {
    await this.api.logout();
    this.metrics.changeUser({ email: 'unknown' });
    this.intercom.changeUser({ name: this.config.intercom.name, email: null });
    this.store.dispatch(this.atom.logout());
  }

  public async login({ user, password }: { user: string; password: string }) {
    this.store.dispatch(this.atom.login());
    try {
      const response = await this.api.login(user, password);
      if (response && typeof response === 'object' && 'token' in response) {
        return this.postLogin(response);
      }
    } catch (e) {
      console.warn('Auth has been expired');
      this.logout();
    }
  }

  private postLogin({
    token,
    refreshToken,
    jwtData,
  }: {
    token: string;
    refreshToken: string;
    jwtData: JWTData;
  }) {
    this.store.dispatch(this.atom.authorize());
    this.metrics.changeUser({ email: jwtData.email });
    this.intercom.changeUser({ email: jwtData.email, name: jwtData.name });
    return true;
  }

  private onTokenExpired() {
    console.warn('User session has been expired. Logging out.');
    this.logout();
  }

  public showLoginForm() {
    this.store.dispatch(this.atom.login());
  }

  public closeLoginForm() {
    this.store.dispatch(this.atom.reset());
  }
}
