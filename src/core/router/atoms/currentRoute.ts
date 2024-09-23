import { matchPath } from 'react-router';
import { configRepo } from '~core/config';
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
    const normalizedLocation = stripBasename(location.pathname, configRepo.get().baseUrl);

    const matchedRoute = routesConfig.routes.find((route) => {
      const path = getAbsoluteRoute(route);
      return matchPath({ path, exact: true }, normalizedLocation);
    });

    if (matchedRoute) {
      return matchedRoute;
    }

    // fallback to default route
    return (
      routesConfig.routes.find((route) => route.id === routesConfig.defaultRoute) ?? null
    );
  },
  'currentRouteAtom',
);

export type CurrentRouteAtom = typeof currentRouteAtom;

export function stripBasename(pathname: string, basename: string): string {
  if (basename === '/') return pathname;
  // leave trailing slash behavior in the user's control
  const startIndex = basename.endsWith('/') ? basename.length - 1 : basename.length;
  return pathname.slice(startIndex) || '/';
}
