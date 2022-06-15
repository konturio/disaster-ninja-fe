import { ProxyOptions } from 'vite';
import packageJson from './package.json';
const host = 'http://localhost:3000';

export const proxyConfig: Record<string, string | ProxyOptions> = {
  /**
   * This proxy help us proxy mapbox tiles requests 
   * For example, record like:
   * '/tiles/stats': 'https://disaster.ninja',
   * will force mapbox take tiles from https://disaster.ninja domain
   */
}


/* Replace api url that require CORS to proxy */
export function replaceUrlWithProxy(originalUrl: string): string {
  return Object.entries(proxyConfig).reduce((url, rule) => {
    const proxyTarget = typeof rule[1] === 'string' ? rule[1] : rule[1].target;
    if (proxyTarget) {
      return url.replace(String(proxyTarget), host);
    } else {
      return url;
    }
  }, originalUrl);
}