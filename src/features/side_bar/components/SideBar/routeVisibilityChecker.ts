import type { AppRoute } from '~core/router';

export function routeVisibilityChecker(routes: AppRoute[]) {
  type RoutesTree = { [key: string]: RoutesTree };
  const routesTree = routes.reduce((tree, route) => {
    if (route.parentRouteId) {
      if (!tree[route.parentRouteId]) tree[route.parentRouteId] = {};
      tree[route.parentRouteId][route.id] = {};
      return tree;
    }
    tree[route.id] = {};
    return tree;
  }, {} as RoutesTree);

  return (route: AppRoute, currentRoute: AppRoute | null): boolean => {
    switch (route.visibilityInNavigation) {
      case 'never':
        return false;

      case 'always':
        return true;

      case 'auto':
      default:
        // always show top level routes
        // hide nested routes if no selected routes in same branch
        if (!route.parentRouteId) return true;
        if (currentRoute === null) return false;
        const isActive = route.id === currentRoute.id;
        const haveActiveParentRoute = route.parentRouteId
          ? currentRoute?.id === route.parentRouteId
          : false;
        const neighbors = route.parentRouteId
          ? Object.keys(routesTree[route.parentRouteId])
          : [];
        const haveActiveNeighbor = neighbors.includes(currentRoute.id);

        return isActive || haveActiveParentRoute || haveActiveNeighbor;
    }
  };
}
