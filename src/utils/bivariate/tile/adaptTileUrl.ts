import config from '~core/app_config';
import { replaceUrlWithProxy } from '../../../../vite.proxy';

export function adaptTileUrl(url: string): string {
  /** Fix cors in local development */
  if (import.meta.env.DEV) {
    url = replaceUrlWithProxy(url);
  }
  /**
   * Protocol fix
   * request from https to http failed in browser with "mixed content" error
   * solution: cut off protocol part and replace with current page protocol
   */
  const protocolRegexp = /https?:/;
  if (protocolRegexp.test(url)) {
    url = window.location.protocol + url.replace(protocolRegexp, '');
  } else {
    const baseUrl =
      config.bivariateTilesServer ??
      `${window.location.protocol}${window.location.host}${window.location.pathname}`;
    url = `${baseUrl}${url}`;
  }

  /**
   * Some link templates use values that mapbox/maplibre do not understand
   * solution: convert to equivalents
   */
  url = url
    .replace('{bbox}', '{bbox-epsg-3857}')
    .replace('{proj}', 'EPSG:3857')
    .replace('{width}', '256')
    .replace('{height}', '256')
    .replace('{zoom}', '{z}')
    .replace('{-y}', '{y}');
  /* Some magic for remove `switch:` */
  const domains = (url.match(/{switch:(.*?)}/) || ['', ''])[1].split(',')[0];
  url = url.replace(/{switch:(.*?)}/, domains);
  return url;
}
