import { urlEncoder } from './encoder';
import type { UrlData } from './types';

export function readInitialUrl() {
  const url = urlEncoder.decode<UrlData>(document.location.search.slice(1));

  return url;
}
