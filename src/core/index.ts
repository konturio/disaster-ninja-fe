import { LocalizationService } from '~core/localization';
import { AppConfigParser } from './app_config';
import { AppMetrics, addAllSequences } from './metrics';
import { NotificationService } from './notifications';
import { Store } from './store';
import * as sharedState from './shared_state';
import { Api } from './api_client';
import { AutoRefreshService } from './auto_refresh';
import { URLStore, URLDataInSearchEncoder, defaultEncoderSettings } from './url_store';
import type { URLStoreInited } from './url_store';
import type {
  LocalizationServiceI,
  AppConfigParsedI,
  AppMetricsI,
  AppStore,
  ApiService,
} from './types';

class Core {
  i18n: LocalizationServiceI;
  config: AppConfigParsedI;
  metrics: AppMetricsI;
  store: AppStore;
  notifications: NotificationService;
  sharedState: typeof sharedState;
  autoRefresh: AutoRefreshService;
  urlStore: URLStoreInited;

  constructor({
    i18n,
    config,
    metrics,
    notifications,
    store,
    autoRefresh,
    urlStore,
  }: {
    i18n: LocalizationServiceI;
    config: AppConfigParsedI;
    metrics: AppMetricsI;
    store: AppStore;
    notifications: NotificationService;
    sharedState: typeof sharedState;
    api: ApiService;
    autoRefresh: AutoRefreshService;
    urlStore: URLStoreInited;
  }) {
    this.i18n = i18n;
    this.config = config;
    this.metrics = metrics;
    this.store = store;
    this.notifications = notifications;
    this.sharedState = sharedState;
    this.autoRefresh = autoRefresh;
    this.urlStore = urlStore;
    this.autoRefresh.start(config.refreshIntervalSec);
  }
}

class BootLoader {
  core!: Core;
  constructor() {
    if (import.meta.env?.PROD) {
      console.info(
        [
          `%c Disaster Ninja ${import.meta.env.PACKAGE_VERSION} deployment:`,
          ` - Build Time: ${import.meta.env.BUILD_TIME}`,
          ` - Git Branch: ${import.meta.env.GIT_BRANCH}`,
          ` - Git Commit: #${import.meta.env.GIT_COMMIT_HASH}`,
          ` - Git Commit Time: ${import.meta.env.GIT_COMMIT_TIME}`,
        ].join('\n'),
        'color: #bada55',
      );
    }
  }

  async load() {
    /* Load metrics */
    const metrics = new AppMetrics();
    addAllSequences(metrics);

    /* Load config and translations */
    const configParser = new AppConfigParser();
    const localization = new LocalizationService();
    const [configData, i18n] = await Promise.all([
      configParser.readConfig(),
      localization.init(),
    ]);
    const config = configParser.init(i18n, configData);
    const store = new Store(metrics).init();
    const notifications = new NotificationService(store);
    const api = new Api({ i18n, config, notifications });
    const autoRefresh = new AutoRefreshService();
    const urlStore = new URLStore({
      encoder: new URLDataInSearchEncoder(defaultEncoderSettings),
      config,
      api,
    }).createAtom();

    /**
     * TODO:
     * - bivariate
     * - draw_tools
     * - logical_layers
     * - router
     */

    this.core = new Core({
      i18n,
      config,
      metrics,
      store,
      notifications,
      sharedState,
      api,
      autoRefresh,
      urlStore,
    });

    return this.core;
  }
}

export const bootLoader = new BootLoader();
export default bootLoader.core;
export * from './types';
