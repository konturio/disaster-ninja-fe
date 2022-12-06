import type { AppRoute } from '~core/router';

export function routeVisibilityChecker(routes: AppRoute[]) {
  type RoutesTree = { [key: string]: RoutesTree };
  const routesTree = routes.reduce((tree, route) => {
    if (route.parentRoute) {
      if (!tree[route.parentRoute]) tree[route.parentRoute] = {};
      tree[route.parentRoute][route.slug] = {};
      return tree;
    }
    tree[route.slug] = {};
    return tree;
  }, {} as RoutesTree);

  return (route: AppRoute, currentRoute: AppRoute | null): boolean => {
    switch (route.visibility) {
      case 'never':
        return false;

      case 'always':
        return true;

      case 'auto':
      default:
        // always show top level routes
        // hide nested routes if no selected routes in same branch
        if (!route.parentRoute) return true;
        if (currentRoute === null) return false;
        const isActive = route.slug === currentRoute.slug;
        const haveActiveParentRoute = route.parentRoute
          ? currentRoute?.slug === route.parentRoute
          : false;
        const neighbors = route.parentRoute
          ? Object.keys(routesTree[route.parentRoute])
          : [];
        const haveActiveNeighbor = neighbors.includes(currentRoute.slug);

        return isActive || haveActiveParentRoute || haveActiveNeighbor;
    }
  };
}
