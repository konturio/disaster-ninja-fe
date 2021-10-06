import { UrlData } from './types';

interface UrlEncoder<
  T = Record<string, string | number | string[] | number[]>,
> {
  encode: (data: T) => string;
  decode: (url: string) => T;
}

export class URLStore {
  _init = false;
  _listener: (nesSate: UrlData) => void = () => {
    /* noop */
  };
  _encoder: UrlEncoder<UrlData>;

  constructor(encoder: UrlEncoder<UrlData>) {
    this._encoder = encoder;
  }

  init() {
    const urlState = this._encoder.decode(document.location.search.slice(1));
    /* If user navigate back state must be ready */
    window.history.replaceState(
      urlState,
      document.title,
      '?' + this._encoder.encode(urlState),
    );

    window.addEventListener('popstate', ({ state }) => {
      this._listener(state);
    });

    this._listener(urlState);
    this._init = true;
  }

  updateUrl(data: UrlData) {
    /**
     * This check allow to skip state updates until original url not read.
     * Without this check url will have rewritten instantly by default state values
     * */
    if (this._init === false) return;

    window.history.pushState(
      data,
      document.title,
      '?' + this._encoder.encode(data),
    );
  }

  onUrlChange(listener: (nesSate: UrlData) => void) {
    this._listener = listener;
  }
}
