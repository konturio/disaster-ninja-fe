import { once } from '~utils/common';
import { cookieManagementService, permissionStatuses } from '~core/cookie_settings';
import { AppMetrics } from './app-metrics';
import { GoogleMetrics } from './externalMetrics/googleMetrics';
import { YandexMetrics } from './externalMetrics/yandexMetrics';
import { addAllSequences } from './sequences';
import type { AppFeatureType } from '~core/auth/types';

const appMetrics = AppMetrics.getInstance();
const googleMetrics = new GoogleMetrics();
export const yandexMetrics = new YandexMetrics();

addAllSequences(appMetrics);

export const initMetricsOnce = once(
  async (appId: string, routeId: string, hasFeature: (f: AppFeatureType) => boolean) => {
    appMetrics.init(appId, routeId, hasFeature);

    /* Enabling / Disabling GTM */
    if (import.meta.env.MODE !== 'development') {
      const externalMetrics = [googleMetrics, yandexMetrics];
      const gtmPermission = cookieManagementService.requestPermission('GTM');
      gtmPermission.onStatusChange((status) => {
        if (status === permissionStatuses.granted) {
          externalMetrics.forEach((metric) => metric.init(appId, routeId));
        }
      });
    }
  },
);
