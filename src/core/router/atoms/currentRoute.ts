import { matchPath } from 'react-router';
import { createAtom } from '~utils/atoms';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { availableRoutesAtom } from './availableRoutes';
import { currentLocationAtom } from './currentLocation';
import type { AppRoute } from '../types';

// Describes current route, but cannot change it
export const currentRouteAtom = createAtom(
  {
    availableRoutesAtom,
    currentLocationAtom,
  },
  ({ get }, state: null | AppRoute = null): null | AppRoute => {
    const routesConfig = get('availableRoutesAtom');
    if (routesConfig === null) return null;
    const location = get('currentLocationAtom');
    return (
      routesConfig.routes.find((route) =>
        matchPath(location.pathname, {
          path: getAbsoluteRoute(
            route.parentRoute ? `${route.parentRoute}/${route.slug}` : route.slug,
          ),
          exact: true,
        }),
      ) ?? null
    );
  },
  'currentRouteAtom',
);

export type CurrentRouteAtom = typeof currentRouteAtom;
