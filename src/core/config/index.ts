import type { Config } from './types';

class ConfigRepository {
  #config: Config | undefined;

  set(config: Config) {
    this.#config = config;
  }

  get() {
    return this.#config!;
  }
}
export default new ConfigRepository();
