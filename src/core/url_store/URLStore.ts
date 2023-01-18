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

  constructor(encoder: UrlEncoder<UrlData>) {
    this._encoder = encoder;
    this._client = apiClient;
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
