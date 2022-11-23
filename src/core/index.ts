import { LocalizationService } from '~core/localization';
import { Application } from './application';
import { AppMetrics, addAllSequences } from './metrics';
import { NotificationService } from './notifications';
import { Store } from './store';
import { SharedState } from './shared_state';
import { Api } from './api_client';
import { AutoRefreshService } from './auto_refresh';
import { URLStore, URLDataInSearchEncoder, defaultEncoderSettings } from './url_store';
import { Router } from './router';
import { AuthenticationService } from './auth';
import { Intercom } from './intercom/Intertcom';
import { CurrentUser } from './current_user';
import { AppFeatures } from './app_features';
import { Feeds } from './feeds';
import type { I18n } from '~core/localization';
import type { AppMetricsI, AppStore, ApiService } from './types';

class Core {
  intercom: Intercom;
  i18n: I18n;
  app: Application;
  metrics: AppMetricsI;
  store: AppStore;
  notifications: NotificationService;
  sharedState!: SharedState;
  api: ApiService;
  autoRefresh: AutoRefreshService;
  urlStore: URLStore;
  router: Router;
  auth: AuthenticationService;
  currentUser: CurrentUser;
  features: AppFeatures;
  feeds: Feeds;

  constructor(services: {
    intercom: Intercom;
    i18n: I18n;
    app: Application;
    metrics: AppMetricsI;
    store: AppStore;
    notifications: NotificationService;
    api: ApiService;
    autoRefresh: AutoRefreshService;
    urlStore: URLStore;
    router: Router;
    auth: AuthenticationService;
    currentUser: CurrentUser;
    features: AppFeatures;
    feeds: Feeds;
  }) {
    this.intercom = services.intercom;
    this.i18n = services.i18n;
    this.app = services.app;
    this.metrics = services.metrics;
    this.notifications = services.notifications;
    this.store = services.store;
    this.api = services.api;
    this.autoRefresh = services.autoRefresh;
    this.urlStore = services.urlStore;
    this.router = services.router;
    this.auth = services.auth;
    this.currentUser = services.currentUser;
    this.features = services.features;
    this.feeds = services.feeds;
    this.autoRefresh.start(services.app.config.refreshIntervalSec);
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
    const autoRefresh = new AutoRefreshService();
    const metrics = new AppMetrics();
    const localization = new LocalizationService();
    addAllSequences(metrics);
    const store = new Store({ metrics }).eject();
    const notifications = new NotificationService({ store });
    const urlStore = new URLStore({
      encoder: new URLDataInSearchEncoder(defaultEncoderSettings),
      store,
    });
    const i18n = await localization.init();
    const application = new Application({ i18n, urlStore, store });
    await application.init();
    const intercom = new Intercom(application);
    const api = new Api({ i18n, config: application.config, notifications });
    application.setClient(api);
    await application.getId();
    application.prepareAtom();
    const auth = new AuthenticationService({
      api,
      store,
      metrics,
      intercom,
      i18n,
      config: application.config,
    });
    await auth.init();
    const currentUser = new CurrentUser({
      store,
      api,
      auth,
      application,
      urlStore
    });
    const features = new AppFeatures({
      store,
      api,
      auth,
      application,
    });
    const feeds = new Feeds({
      store,
      api,
      auth,
      application,
    });
    const router = new Router().init({ i18n, config: application.config, features });
    this.core = new Core({
      intercom,
      i18n,
      app: application,
      metrics,
      store,
      notifications,
      api,
      autoRefresh,
      urlStore,
      router,
      auth,
      currentUser,
      features,
      feeds,
    });

    return this.core;
  }

  initSharedState() {
    this.core.sharedState = new SharedState();
  }
}

export const bootLoader = new BootLoader();
export default bootLoader.core;
export * from './types';
