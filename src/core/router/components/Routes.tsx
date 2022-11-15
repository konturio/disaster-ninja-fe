import { Suspense } from 'react';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { Router, Route, Redirect } from 'react-router-dom';
import { useAtom } from '@reatom/react';
import history from '~core/history';
import { CommonRoutesFeatures } from '~views/Common';
import { availableRoutesAtom } from '../atoms/availableRoutes';
import { getAbsoluteRoute } from '../routes';
import { UniversalRoute } from './UniversalRoute';
import type { AppRouterConfig } from '../types';

const RouterStateToReactRouter = ({ routes }: { routes: AppRouterConfig['routes'] }) => {
  return (
    <>
      {routes.map((r) => (
        <UniversalRoute
          key={r.slug}
          exact
          path={getAbsoluteRoute(r.slug)}
          as={r.cached ? CacheRoute : Route}
        >
          <Suspense fallback={null}>{r.view}</Suspense>
        </UniversalRoute>
      ))}
    </>
  );
};

export function Routes() {
  const [availableRoutes] = useAtom(availableRoutesAtom);
  if (availableRoutes === null) return null; // Maybe some loading screen needed?
  return (
    <Router history={history}>
      <CommonRoutesFeatures>
        <CacheSwitch>
          <RouterStateToReactRouter routes={availableRoutes.routes} />
          <Redirect to={getAbsoluteRoute(availableRoutes.defaultRoute)} />
        </CacheSwitch>
      </CommonRoutesFeatures>
    </Router>
  );
}
