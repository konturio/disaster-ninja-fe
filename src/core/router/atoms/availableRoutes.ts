import { createAtom } from '~utils/atoms';
import { configRepo } from '~core/config';
import { featureFlagsAtom } from '~core/shared_state';
import { routerConfig } from '../routes';
import type { AppRouterConfig } from '../types';

export const availableRoutesAtom = createAtom(
  {
    featureFlagsAtom,
  },
  ({ get }): AppRouterConfig | null => {
    const featureFlags = get('featureFlagsAtom');
    return getAvailableRoutes();
  },
  'availableRoutesAtom',
);

export type AvailableRoutesAtom = typeof availableRoutesAtom;

export function getAvailableRoutes() {
  const featureFlags = configRepo.get().features;
  /* Remove not available routes */
  const available = {
    ...routerConfig,
    routes: routerConfig.routes.filter((route) =>
      route.requiredFeature ? featureFlags[route.requiredFeature] : true,
    ),
  };

  const defaultRoute = available.routes.find((r) => r.slug === available.defaultRoute);

  if (defaultRoute?.disabled) {
    const newDefault = available.routes.find((r) => !r.disabled && !r.parentRoute);
    if (newDefault) {
      available.defaultRoute = newDefault.slug;
    } else {
      console.error('default route not available');
    }
  }
  return available;
}
