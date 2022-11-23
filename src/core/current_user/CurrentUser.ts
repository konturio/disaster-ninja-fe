import { PUBLIC_USER_ID } from './constants';
import { createCurrentUserProfileAtom } from './atoms/currentUserProfileAtom';
import type { ProfileAtom } from './atoms/currentUserProfileAtom';
import type { ApiService, AppConfigParsedI, AppStore } from '..';
import type { AuthenticationService } from '~core/auth';
import type { Application } from '~core/application';
import type { UserProfile } from './types';
import type { URLStore } from '~core/url_store';

export class CurrentUser {
  private client: ApiService['apiClient'];
  private config: AppConfigParsedI;
  private urlStore: URLStore;
  public atom: ProfileAtom;

  constructor({
    store,
    api,
    auth,
    application,
    urlStore
  }: {
    api: ApiService;
    store: AppStore;
    auth: AuthenticationService;
    application: Application;
    urlStore: URLStore
  }) {
    this.urlStore = urlStore;
    this.config = application.config;
    this.client = api.apiClient;
    this.atom = createCurrentUserProfileAtom(
      store,
      this.client,
      auth.atom,
      () => this.getPublicUseProfile(),
    );
  }

  userWasLanded() {
    const initialUrl = new URL(this.urlStore.initialUrlRaw);
    const noSettingUrl =
      location.pathname === this.config.baseUrl && initialUrl.search === '';
    const userHaveLandedMark = localStorage.getItem('landed');
    if (noSettingUrl && !userHaveLandedMark) {
      localStorage.setItem('landed', 'true');
      return false;
    } else {
      return true
    }
  }

  isPublicUser(userId: string) {
    return userId === PUBLIC_USER_ID;
  }

  private getPublicUseProfile(): UserProfile {
    return {
      id: PUBLIC_USER_ID,
      osmEditor: this.config.osmEditors[0].id,
      defaultFeed: this.config.defaultFeedObject.feed,
      useMetricUnits: true,
      username: '',
      email: '',
      fullName: '',
      language: 'en',
      subscribedToKonturUpdates: false,
      bio: '',
      theme: 'kontur',
    };
  }

  async getDefaultLayers(appId: string) {
    // ! TEMPORARY MOCK
    // Backend right not can't send as layers that not in layers API,
    // So we should wait until all layers migrated to Layers API
    // Until that moment we take static list of default layers
    // * That similar for all applications *
    // Ask Alexander Zapasnik before remove this
    if (this.config.layersByDefault) {
      return new Promise<string[]>((res) => {
        res(this.config.layersByDefault);
      });
    } else {
      const layers = await this.client.get<{ id: string }[] | null>(
        `/apps/${appId}/layers/`,
        undefined,
        false,
      );
      return layers?.map((l) => l.id) ?? null;
    }
  }
}
