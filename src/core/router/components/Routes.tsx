import { Suspense, useEffect } from 'react';
import { CacheRoute } from 'react-router-cache-route';
import { Route, Redirect } from 'react-router-dom';
import { useAction, useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { availableRoutesAtom } from '../atoms/availableRoutes';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { showAboutForNewUsersAtom } from '../atoms/showAboutForNewUsers';
import { UniversalRoute } from './UniversalRoute';
import s from './Router.module.css';
import type { AppRouterConfig } from '../types';

const RouterStateToReactRouter = ({ routes }: { routes: AppRouterConfig['routes'] }) => {
  const showAboutForNewUsers = useAction(showAboutForNewUsersAtom.showAboutForNewUsers);
  /* Router must be synchronized with react-render lifecycle */
  useEffect(() => {
    showAboutForNewUsers();
  }, [showAboutForNewUsers]);

  return (
    <>
      {routes.map((r) => (
        <UniversalRoute
          className={r.cached ? s.fullWidth : undefined}
          key={r.slug}
          exact
          path={getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug)}
          as={r.cached ? CacheRoute : Route}
        >
          <Suspense fallback={<LoadingSpinner message={null} />}>{r.view}</Suspense>
        </UniversalRoute>
      ))}
    </>
  );
};

export function Routes() {
  const [availableRoutes] = useAtom(availableRoutesAtom);
  if (availableRoutes === null) {
    return (
      <div className={s.fullWidth}>
        <LoadingSpinner message={null} />
      </div>
    );
  }
  return (
    <>
      <RouterStateToReactRouter routes={availableRoutes.routes} />
      <Redirect to={getAbsoluteRoute(availableRoutes.defaultRoute)} />
    </>
  );
}
