import type { UrlData } from '~core/url_store';
import type { AppConfig, Config, StageConfig } from './types';
import type { UserDto } from '~core/app/user';
import type { LayerDetailsDto } from '~core/logical_layers/types/source';

class ConfigRepository {
  #config: Config | undefined;

  set({
    baseUrl,
    initialUrl,
    initialUrlData,
    stageConfig,
    appConfig,
    baseMapUrl,
    initialUser,
    defaultLayers,
    activeLayers,
  }: {
    baseUrl: string;
    initialUrl: string;
    initialUrlData: UrlData;
    stageConfig: StageConfig;
    appConfig: AppConfig;
    baseMapUrl: string;
    initialUser: UserDto;
    defaultLayers: LayerDetailsDto[];
    activeLayers: string[];
  }) {
    this.#config = {
      baseUrl,
      initialUrl,
      initialUrlData,
      ...stageConfig,
      ...appConfig,
      mapBaseStyle: baseMapUrl,
      features:
        Object.keys(appConfig.features).length > 0
          ? appConfig.features
          : stageConfig.featuresByDefault,
      initialUser,
      defaultLayers,
      activeLayers,
    };
  }

  get() {
    return this.#config!;
  }

  /* -- Intercom staff -- */

  #readSessionIntercomSetting = (key: string) =>
    sessionStorage.getItem(`kontur.intercom.${key}`);
  getIntercomSettings() {
    return {
      intercomAppId: this.#config!.intercomAppId,
      intercomSelector: this.#config!.intercomSelector,
      name: this.#readSessionIntercomSetting('name'),
      email: this.#readSessionIntercomSetting('email'),
      phone: this.#readSessionIntercomSetting('phone'),
    };
  }

  #setIntercomSetting = (k: string, v?: string) => {
    const key = `kontur.intercom.${k}`;
    v ? sessionStorage.setItem(key, v) : sessionStorage.removeItem(key);
  };
  updateIntercomSettings(settings: Record<string, string>) {
    Object.entries(settings).forEach(([k, v]) => this.#setIntercomSetting(k, v));
  }
}
export const configRepo = new ConfigRepository();
