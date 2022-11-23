import { matchPath } from 'react-router';
import { createAtom } from '~core/store/atoms';
import type { AvailableRoutesAtom } from './availableRoutes';
import type { CurrentLocationAtom } from './currentLocation';
import type { AppRoute } from '../types';

export const createCurrentRouteAtom = ({
  availableRoutesAtom,
  currentLocationAtom,
  getAbsoluteRoute
}: {
  availableRoutesAtom: AvailableRoutesAtom,
  currentLocationAtom: CurrentLocationAtom,
  getAbsoluteRoute: (slug: string) => string
}) => createAtom(
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

export type CurrentRouteAtom = ReturnType<typeof createCurrentRouteAtom>