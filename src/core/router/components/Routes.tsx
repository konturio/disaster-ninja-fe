import { Suspense, useEffect } from 'react';
import { CacheRoute } from 'react-router-cache-route';
import { Route } from 'react-router-dom';
import { useAction, useAtom } from '@reatom/react-v2';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { featuresWereSetAtom } from '~core/app/features';
import { availableRoutesAtom } from '../atoms/availableRoutes';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { showAboutForNewUsersAtom } from '../atoms/showAboutForNewUsers';
import { UniversalRoute } from './UniversalRoute';
import s from './Router.module.css';
import { use404Redirect } from './user404Redirect';
import type { AppRouterConfig } from '../types';

const FullScreenLoader = () => (
  <div className={s.fullWidth}>
    <LoadingSpinner message={null} />
  </div>
);

const RouterStateToReactRouter = ({
  availableRoutes,
}: {
  availableRoutes: AppRouterConfig;
}) => {
  const showAboutForNewUsers = useAction(showAboutForNewUsersAtom.showAboutForNewUsers);
  /* Router must be synchronized with react-render lifecycle */
  useEffect(() => {
    showAboutForNewUsers();
  }, [showAboutForNewUsers]);

  return (
    <>
      {availableRoutes.routes.map((r) => (
        <UniversalRoute
          className={r.cached ? s.fullWidth : undefined}
          key={r.slug}
          exact
          path={getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug)}
          as={r.cached ? CacheRoute : Route}
        >
          <Suspense fallback={<FullScreenLoader />}>{r.view}</Suspense>
        </UniversalRoute>
      ))}
    </>
  );
};

export function Routes() {
  const [availableRoutes] = useAtom(availableRoutesAtom);
  const [featuresWereSet] = useAtom(featuresWereSetAtom);

  use404Redirect(availableRoutes, featuresWereSet);

  if (availableRoutes === null) {
    return <FullScreenLoader />;
  }

  return <RouterStateToReactRouter availableRoutes={availableRoutes} />;
}
