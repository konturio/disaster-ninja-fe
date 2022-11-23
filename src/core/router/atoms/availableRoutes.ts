import { createAtom } from '~core/store/atoms';
import type { AppFeatures } from '~core/app_features';
import type { AppRouterConfig } from '../types';

export const createAvailableRoutesAtom = (routerConfig: AppRouterConfig, features: AppFeatures) => createAtom(
  {
    features: features.atom
  },
  ({ get }): AppRouterConfig | null => {
    const features = get('features');
    /* Remove not available routes */
    return {
      ...routerConfig,
      routes: routerConfig.routes.filter((route) =>
        route.requiredPermission ? features.has(route.requiredPermission) : true,
      ),
    };
  },
  'availableRoutesAtom',
);

export type AvailableRoutesAtom = ReturnType<typeof createAvailableRoutesAtom>;