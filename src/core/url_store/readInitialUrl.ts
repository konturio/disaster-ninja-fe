import { urlEncoder } from './encoder';
import type { UrlData } from './types';

export function readInitialUrl() {
  const url = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  // HACK: Remove KLA__ prefix from layers ids coming from url
  url.layers = (url.layers ?? []).map((l) => l.replace(/^KLA__/, ''));

  return url;
}
