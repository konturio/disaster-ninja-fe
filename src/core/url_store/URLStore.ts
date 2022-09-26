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

  constructor(encoder: UrlEncoder<UrlData>) {
    this._encoder = encoder;
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
}
