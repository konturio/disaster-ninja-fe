import type { AppRoute } from './types';

const trimSlash = (str: string) => {
  // Trim leading and trailing slashes
  return str.replace(/^\/|\/$/g, '');
};

const pathJoin = (...path: Array<string>) => {
  return path
    .map(trimSlash)
    .filter((path) => path.length !== 0)
    .join('/');
};

export const getAbsoluteRoute = (slugOrRoute: string | AppRoute, base = '') => {
  if (typeof slugOrRoute === 'string') return '/' + pathJoin(base, slugOrRoute);

  return getAbsoluteRoute(
    slugOrRoute.parentRouteId
      ? `${slugOrRoute.parentRouteId}/${slugOrRoute.slug}`
      : slugOrRoute.slug,
    base,
  );
};
