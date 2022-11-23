import { Suspense } from 'react';
import { CacheRoute } from 'react-router-cache-route';
import { Route, Redirect } from 'react-router-dom';
import { useAtom } from '@reatom/react';
import core from '~core/index';
import { UniversalRoute } from './UniversalRoute';
import type { AppRouterConfig } from '../types';

const RouterStateToReactRouter = ({ routes }: { routes: AppRouterConfig['routes'] }) => {
  return (
    <>
      {routes.map((r) => (
        <UniversalRoute
          key={r.slug}
          exact
          path={core.router.getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug)}
          as={r.cached ? CacheRoute : Route}
        >
          <Suspense fallback={<h1>Fallback</h1>}>{r.view}</Suspense>
        </UniversalRoute>
      ))}
    </>
  );
};

export function Routes() {
  const [availableRoutes] = useAtom(core.router.atoms.availableRoutesAtom);
  if (availableRoutes === null) return <h1>Loading</h1>; // Maybe some loading screen needed?
  return (
    <>
      <RouterStateToReactRouter routes={availableRoutes.routes} />
      <Redirect to={core.router.getAbsoluteRoute(availableRoutes.defaultRoute)} />
    </>
  );
}
