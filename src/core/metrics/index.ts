import { once } from '~utils/common';
import { cookieManagementService, permissionStatuses } from '~core/cookie_settings';
import { AppMetrics } from './app-metrics';
import { GoogleMetrics } from './externalMetrics/googleMetrics';
import { YandexMetrics } from './externalMetrics/yandexMetrics';
import { MatomoMetrics } from './externalMetrics/matomoMetrics';
import { addAllSequences } from './sequences';

const appMetrics = AppMetrics.getInstance();
const googleMetrics = new GoogleMetrics();
export const yandexMetrics = new YandexMetrics();
const matomoMetrics = new MatomoMetrics();

addAllSequences(appMetrics);

export const initMetricsOnce = once(async (appId: string, routeId: string) => {
  appMetrics.init(appId, routeId);

  /* Enabling / Disabling GTM */
  if (import.meta.env.MODE !== 'development') {
    const externalMetrics = [googleMetrics, yandexMetrics, matomoMetrics];
    const gtmPermission = cookieManagementService.requestPermission('GTM');
    gtmPermission.onStatusChange((status) => {
      if (status === permissionStatuses.granted) {
        externalMetrics.forEach((metric) => metric.init(appId, routeId));
      }
    });
  }
});
