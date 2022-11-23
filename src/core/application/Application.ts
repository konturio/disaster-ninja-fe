import { AppConfigParser } from './AppConfigParser';
import { createAppSettingsAtom } from './atoms/appSettingsAtom';
import type { AppSettingsAtom} from './atoms/appSettingsAtom';
import type { URLStore } from '~core/url_store';
import type { ApiService, AppConfigParsedI, AppStore, I18n } from '..';

export class Application {
  public id: string | null = null;
  public config!: AppConfigParsedI;
  public atom!: AppSettingsAtom;
  private store: AppStore;
  private parser: AppConfigParser;
  private i18n: I18n;
  private urlStore: URLStore;
  private client: ApiService['apiClient'] | null = null;

  constructor({ i18n, store, urlStore }) {
    this.store = store;
    this.parser = new AppConfigParser();
    this.i18n = i18n;
    this.urlStore = urlStore;
  }

  async init() {
    this.config = await this.readConfig().then((rawConfig) =>
      this.parser.parseConfig(rawConfig, this.i18n),
    );
  }

  async readConfig() {
    const response = await fetch(`${import.meta.env?.BASE_URL}config/appconfig.json`);
    // Here we can add runtime config check.
    // Example in scripts/build-config-scheme.mjs
    const config = await response.json();
    return config;
  }

  setClient(api: ApiService) {
    this.client = api.apiClient;
  }

  async getId() {
    this.id = this.urlStore.initialUrlData.app ?? (await this.getDefaultAppId());
    !this.urlStore.initialUrlData.app && this.urlStore.patchState({ app: this.id! });
  }

  readId() {
    return this.id;
  }

  prepareAtom() {
    if (this.client === null) throw Error('You must set client first');
    this.atom = createAppSettingsAtom({
      client: this.client,
      readId: () => this.readId()!,
      store: this.store,
    });
  }

  async getDefaultAppId() {
    if (this.client === null) throw Error('You must set client first');
    return this.client.get<string>('/apps/default_id')
  }
}
