import { createFeedsAtom } from './atoms/feedsAtom';
import type { FeedsAtom } from './atoms/feedsAtom';
import type { ApiService, AppConfigParsedI, AppStore } from '..';
import type { AuthenticationService } from '~core/auth';
import type { Application } from '~core/application';
import type { UserFeed } from './types';


export class Feeds {
  private client: ApiService['apiClient'];
  private config: AppConfigParsedI;
  public atom: FeedsAtom;
  public defaultFeed: UserFeed

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
    this.defaultFeed = this.config.defaultFeedObject;
    this.client = api.apiClient;
    this.atom = createFeedsAtom({
      store,
      client: this.client,
      defaultFeeds: [this.config.defaultFeedObject],
      authAtom: auth.atom,
    });
  }
}