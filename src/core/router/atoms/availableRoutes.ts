import { createAtom } from '~utils/atoms';
import { userResourceAtom } from '~core/auth';
import { routerConfig } from '../routes';
import type { AppRouterConfig } from '../types';

export const availableRoutesAtom = createAtom(
  {
    userResourceAtom,
  },
  ({ get }): AppRouterConfig | null => {
    const { data: userModel } = get('userResourceAtom');
    if (userModel === null) return null;

    /* Remove not available routes */
    return {
      ...routerConfig,
      routes: routerConfig.routes.filter((route) =>
        route.requiredFeature ? userModel.hasFeature(route.requiredFeature) : true,
      ),
    };
  },
  'availableRoutesAtom',
);

export type AvailableRoutesAtom = typeof availableRoutesAtom;
