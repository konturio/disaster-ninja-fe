import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import { routerConfig } from '../routes';
import type { AppRouterConfig } from '../types';

export const availableRoutesAtom = createAtom(
  {},
  ({ get }): AppRouterConfig | null => {
    return getAvailableRoutes();
  },
  'availableRoutesAtom',
);

export type AvailableRoutesAtom = typeof availableRoutesAtom;

export function getAvailableRoutes() {
  const featureFlags = configRepo.get().features;
  const currentAppId = configRepo.get().id;
  /* Remove not available routes */
  const available = {
    ...routerConfig,
    routes: routerConfig.routes.filter(
      (route) =>
        (route.requiredFeature ? featureFlags[route.requiredFeature] : true) &&
        (route.allowedAppIds ? route.allowedAppIds.includes(currentAppId) : true),
    ),
  };

  const defaultRoute = available.routes.find((r) => r.slug === available.defaultRoute);

  if (!defaultRoute || defaultRoute?.disabled) {
    const newDefault = available.routes.find((r) => !r.disabled && !r.parentRouteId);
    if (newDefault) {
      available.defaultRoute = newDefault.slug;
    } else {
      console.error('default route not available');
    }
  }
  return available;
}
