import { apiClient } from '~core/apiClientInstance';
import type { ApiClient } from '~core/api_client';
import type { UrlData } from './types';

interface UrlEncoder<T extends Record<string, string | number | string[] | number[]>> {
  encode: (data: T) => string;
  decode: (url: string) => T;
}

export class URLStore {
  _listener: (nesSate: UrlData) => void = () => {
    /* noop */
  };
  _encoder: UrlEncoder<UrlData>;
  _client: ApiClient;

  getDefaults = {
    app: async () => {
      try {
        return await this._client.get<string>('/apps/default_id');
      } catch (e) {
        console.error('[URLStore]: Failed to get default app id');
        console.debug(e);
      }
    },
    layers: async (appId: string) => {
      const layers = await this._client.get<{ id: string }[] | null>(
        `/apps/${appId}/layers/`,
        undefined,
        false,
      );
      return layers?.map((l) => l.id) ?? null;
    },
  };
  constructor(encoder: UrlEncoder<UrlData>) {
    this._encoder = encoder;
    this._client = apiClient;
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
    const urlState = this._encoder.decode(document.location.search.slice(1));
    return urlState;
  }

  updateUrl(data: UrlData) {
    window.history.pushState(data, document.title, '?' + this._encoder.encode(data));
  }

  onUrlChange(listener: (nesSate: UrlData) => void) {
    window.addEventListener('popstate', ({ state }) => {
      listener(state);
    });
  }

  toSearchSting(data: UrlData) {
    return '?' + this._encoder.encode(data);
  }
}
