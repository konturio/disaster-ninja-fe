import type { Config } from './types';

class ConfigRepository {
  #config: Config | undefined;

  set(config: Config) {
    this.#config = config;
  }

  get() {
    return this.#config!;
  }

  #readSessionIntercomSetting = (key: string) =>
    sessionStorage.getItem(`kontur.intercom.${key}`);
  getIntercomSettings() {
    return {
      intercomAppId: this.#config!.intercomAppId,
      intercomSelector: this.#config!.intercomSelector,
      name: this.#readSessionIntercomSetting('name'),
      email: this.#readSessionIntercomSetting('email'),
    };
  }

  #setIntercomSetting = (k: string, v?: string) => {
    const key = `kontur.intercom.${k}`;
    v ? sessionStorage.setItem(key, v) : sessionStorage.removeItem(key);
  };
  updateIntercomSettings(settings: { name?: string; email?: string }) {
    Object.entries(settings).forEach(([k, v]) => this.#setIntercomSetting(k, v));
  }
}
export default new ConfigRepository();
