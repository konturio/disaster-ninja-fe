import { ProxyOptions } from 'vite';

/**
 * This proxy help us proxy mapbox tiles requests
 * For example, record like:
 * '/tiles/stats': 'https://disaster.ninja',
 * will force mapbox take tiles from https://disaster.ninja domain
 */

async function getLocalConfig() {
  try {
    const res = await import('./configs/proxy-config.local');
    console.log(
      'Applying local vite proxy config file from ./configs/proxy-config.local.js',
    );
    return res.default;
  } catch (e) {
    try {
      const res = await import('./configs/proxy-config.default');
      console.log(
        'Applying local vite proxy config file from ./configs/proxy-config.default.js',
      );
      return res.default;
    } catch (e) {
      console.log('Not found any proxy configs');
      return {};
    }
  }
}

export const proxyConfig: Record<string, string | ProxyOptions> = await getLocalConfig();
