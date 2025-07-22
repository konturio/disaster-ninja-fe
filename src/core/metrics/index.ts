import { once } from '~utils/common';
import { cookieManagementService, permissionStatuses } from '~core/cookie_settings';
import { AppMetrics } from './app-metrics';
import { GoogleMetrics } from './externalMetrics/googleMetrics';
import { MatomoMetrics } from './externalMetrics/matomoMetrics';
import { YandexMetrics } from './externalMetrics/yandexMetrics';
import { addAllSequences } from './sequences';

const appMetrics = AppMetrics.getInstance();
const googleMetrics = new GoogleMetrics();
const matomoMetrics = new MatomoMetrics();
export const yandexMetrics = new YandexMetrics();

addAllSequences(appMetrics);

export const initMetricsOnce = once(async (appId: string, routeId: string) => {
  appMetrics.init(appId, routeId);

  /* Enabling / Disabling GTM */
  if (import.meta.env.MODE !== 'development') {
    const externalMetrics = [googleMetrics, matomoMetrics, yandexMetrics];
    const gtmPermission = cookieManagementService.requestPermission('GTM');
    gtmPermission.onStatusChange((status) => {
      if (status === permissionStatuses.granted) {
        externalMetrics.forEach((metric) => metric.init(appId, routeId));
      }
    });
  }
});
