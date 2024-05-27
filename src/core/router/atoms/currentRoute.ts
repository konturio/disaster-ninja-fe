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
        matchPath(
          {
            path: getAbsoluteRoute(route),
            exact: true,
          },
          location.pathname,
        ),
      ) ?? null
    );
  },
  'currentRouteAtom',
);

export type CurrentRouteAtom = typeof currentRouteAtom;
