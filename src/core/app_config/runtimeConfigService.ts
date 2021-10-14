type cbs = {
  success: ((config: RuntimeConfig) => void)[];
  error: ((error: string) => void)[];
};

class RuntimeConfigService {
  cbs: cbs = {
    success: [],
    error: [],
  };
  cache: null | RuntimeConfig = null;

  constructor(configUrl: string) {
    this.fetchConfig(configUrl)
      .then((config) => this.emitSuccess(config))
      .catch((error) => this.emitError(error));
  }

  onSuccess(cb: (config: RuntimeConfig) => void) {
    this.cbs.success.push(cb);
  }

  onError(cb: (error: string) => void) {
    this.cbs.error.push(cb);
  }

  emitSuccess(payload: RuntimeConfig) {
    this.cbs.success.forEach((cb) => cb(payload));
  }

  emitError(payload: string) {
    this.cbs.error.forEach((cb) => cb(payload));
  }

  async fetchConfig(url: string) {
    const response = await fetch(url);
    if (response.ok) {
      const config = await response.json();
      Object.freeze(config);
      this.cache = config;
      return config;
    } else {
      throw Error(response.statusText);
    }
  }
}

const runtimeConfig = new RuntimeConfigService('/public/appconfig.json'); // Defined in ansible/deploy.yml

export function getRuntimeConfig(): Promise<RuntimeConfig> {
  const { cache } = runtimeConfig;
  if (cache !== null) {
    return Promise.resolve(cache);
  }
  return new Promise((res, rej) => {
    runtimeConfig.onSuccess(res);
    runtimeConfig.onError(rej);
  });
}
