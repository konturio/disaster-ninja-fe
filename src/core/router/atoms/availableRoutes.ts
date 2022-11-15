import { createAtom } from '~utils/atoms';
import { userResourceAtom } from '~core/auth';
import { config } from '../routes';
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
      ...config,
      routes: config.routes.filter((route) =>
        route.requiredPermission ? userModel.hasFeature(route.requiredPermission) : true,
      ),
    };
  },
  'availableRoutesAtom',
);
