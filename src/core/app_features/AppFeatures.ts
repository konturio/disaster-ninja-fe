import { createFeaturesAtom } from './atoms/featuresAtom';
import type { FeaturesAtom } from './atoms/featuresAtom';
import type { ApiService, AppConfigParsedI, AppStore } from '..';
import type { AppFeatureType } from './types';
import type { AuthenticationService } from '~core/auth';
import type { Application } from '~core/application';


export class AppFeatures {
  private client: ApiService['apiClient'];
  private config: AppConfigParsedI;
  public atom: FeaturesAtom;

  constructor({
    store,
    api,
    auth,
    application
  }: {
    api: ApiService;
    store: AppStore;
    auth: AuthenticationService;
    application: Application
  }) {
    this.config = application.config;
    this.client = api.apiClient;
    this.atom = createFeaturesAtom({
      store,
      client: this.client,
      publicUserFeatures: new Set(this.config.featuresByDefault as Array<AppFeatureType>),
      authAtom: auth.atom,
      app: application,
    });
  }
}