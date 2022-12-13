import once from 'lodash/once';
import { cookieManagementService } from '~core/cookie_settings';
import { AppMetrics } from './app-metrics';
import { GoogleMetrics } from './externalMetrics/googleMetrics';
import { YandexMetrics } from './externalMetrics/yandexMetrics';
import { addAllSequences } from './sequences';

const appMetrics = AppMetrics.getInstance();
const googleMetrics = new GoogleMetrics();
export const yandexMetrics = new YandexMetrics();

addAllSequences(appMetrics);

export const initMetricsOnce = once(async (appId: string, route: string) => {
  // TODO: Check metrics flag
  appMetrics.init(appId, route);

  /* Enabling / Disabling GTM */
  const externalMetrics = [googleMetrics, yandexMetrics];
  const gtmPermission = cookieManagementService.requestPermission('GTM');
  gtmPermission.onStatusChange((status) => {
    if (status === 'granted') {
      externalMetrics.forEach((metric) => metric.init(appId, route));
    }
  });
});
