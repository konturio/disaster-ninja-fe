import { createUrlStoreAtom } from './atoms/urlStore';
import type { ApiService, AppConfigParsedI } from '..';
import type { UrlData } from './types';
import type { NonNullableField } from 'types/typeUtils';

interface UrlEncoder<T extends Record<string, string | number | string[] | number[]>> {
  encode: (data: T) => string;
  decode: (url: string) => T;
}

export type URLStoreInited = NonNullableField<URLStore, 'atom'>;

export class URLStore {
  config: AppConfigParsedI;
  client: ApiService['apiClient'];
  encoder: UrlEncoder<UrlData>;
  atom: ReturnType<typeof createUrlStoreAtom> | null = null;

  _listener: (nesSate: UrlData) => void = () => {
    /* noop */
  };

  getDefaults = {
    app: async () => {
      try {
        return await this.client.get<string>('/apps/default_id');
      } catch (e) {
        console.error('[URLStore]: Failed to get default app id');
        console.debug(e);
      }
    },
    layers: async (appId: string) => {
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
    },
  };

  constructor({
    encoder,
    config,
    api,
  }: {
    encoder: UrlEncoder<UrlData>;
    config: AppConfigParsedI;
    api: ApiService;
  }) {
    this.config = config;
    this.encoder = encoder;
    this.client = api.apiClient;
    this.createAtom();
  }

  async getInitialState() {
    const initialUrl = this.readCurrentState();

    if (initialUrl.app === undefined) {
      const appId = await this.getDefaults.app();
      if (appId) initialUrl.app = appId;
    }

    if (initialUrl.layers === undefined && initialUrl.app) {
      const layers = await this.getDefaults.layers(initialUrl.app);
      if (layers) initialUrl.layers = layers;
    }

    this.updateUrl(initialUrl);
    return initialUrl;
  }

  readCurrentState() {
    const urlState = this.encoder.decode(document.location.search.slice(1));
    return urlState;
  }

  updateUrl(data: UrlData) {
    window.history.pushState(data, document.title, '?' + this.encoder.encode(data));
  }

  onUrlChange(listener: (nesSate: UrlData) => void) {
    window.addEventListener('popstate', ({ state }) => {
      listener(state);
    });
  }

  toSearchSting(data: UrlData) {
    return '?' + this.encoder.encode(data);
  }

  createAtom() {
    this.atom = createUrlStoreAtom(this);
    return this as URLStoreInited;
  }
}
