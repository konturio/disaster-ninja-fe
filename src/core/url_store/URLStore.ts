import { createUrlStoreAtom } from './atoms/urlStore';
import type { AppStore } from '..';
import type { UrlData } from './types';

interface UrlEncoder<T extends Record<string, string | number | string[] | number[]>> {
  encode: (data: T) => string;
  decode: (url: string) => T;
}

export class URLStore {
  encoder: UrlEncoder<UrlData>;
  atom: ReturnType<typeof createUrlStoreAtom>;
  initialUrlRaw = location.href;
  initialUrlData: UrlData

  _listener: (nesSate: UrlData) => void = () => {
    /* noop */
  };

  constructor({ encoder, store }: { encoder: UrlEncoder<UrlData>, store: AppStore }) {
    this.encoder = encoder;
    this.atom = createUrlStoreAtom(this, store);
    this.initialUrlData = this.readCurrentState();
  }

  patchState(patch: UrlData) {
    const url = this.readCurrentState();
    this.updateUrl({ ...url, ...patch });
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
}
