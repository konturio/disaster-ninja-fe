import { createAtom } from '~utils/atoms';
import { featureFlagsAtom } from '~core/shared_state';
import { routerConfig } from '../routes';
import type { AppRouterConfig } from '../types';

export const availableRoutesAtom = createAtom(
  {
    featureFlagsAtom,
  },
  ({ get }): AppRouterConfig | null => {
    const featureFlags = get('featureFlagsAtom');

    /* Remove not available routes */
    return {
      ...routerConfig,
      routes: routerConfig.routes.filter((route) =>
        route.requiredFeature ? featureFlags[route.requiredFeature] : true,
      ),
    };
  },
  'availableRoutesAtom',
);

export type AvailableRoutesAtom = typeof availableRoutesAtom;
