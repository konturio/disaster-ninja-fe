import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { goTo } from '../goTo';
import type { AppRouterConfig } from '../types';

export function use404Redirect(
  availableRoutes: AppRouterConfig | null,
  featuresWereSet: boolean,
) {
  const location = useLocation();
  useEffect(() => {
    if (!availableRoutes) return;
    const match = availableRoutes.routes.find((r) => {
      return matchPath(location.pathname, {
        path: getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug),
        exact: true,
        strict: false,
      });
    });

    if (!match && featuresWereSet) {
      goTo(availableRoutes.defaultRoute);
    }
  }, [location, availableRoutes]);
}
