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
        route.requiredPermission ? userModel.hasFeature(route.requiredPermission) : true,
      ),
    };
  },
  'availableRoutesAtom',
);
