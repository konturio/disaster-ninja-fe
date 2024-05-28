import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
import { KeepAliveProvider } from 'react-component-keepalive-ts';
import { Suspense } from 'react';
import { PostInit } from '~core/postInit';
import { CommonView } from '~views/CommonView';
import { configRepo } from '~core/config';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { availableRoutesAtom, getAvailableRoutes } from '../atoms/availableRoutes';
import { currentRouteAtom } from '../atoms/currentRoute';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { NAVIGATE_EVENT } from '../goTo';
import { currentLocationAtom } from '../atoms/currentLocation';

export const routerInstance = createBrowserRouter(getRoutes(), {
  basename: configRepo.get().baseUrl,
});

routerInstance.subscribe((e) => {
  // @ts-expect-error ok since we are using only pathanme prop
  currentLocationAtom.set.dispatch(e.location);
});

globalThis.addEventListener(NAVIGATE_EVENT, ((e: CustomEvent) => {
  const slug = e.detail.payload;
  routerInstance.navigate(getAbsoluteRoute(slug) + globalThis.location.search);
}) as EventListener);

export function Router() {
  return <RouterProvider router={routerInstance} />;
}

function Layout() {
  return (
    <>
      <PostInit />
      <CommonView
        availableRoutesAtom={availableRoutesAtom}
        currentRouteAtom={currentRouteAtom}
        getAbsoluteRoute={getAbsoluteRoute}
      >
        <KeepAliveProvider>
          <Outlet />
        </KeepAliveProvider>
      </CommonView>
    </>
  );
}

export function getRoutes(): RouteObject[] {
  const featureFlags = configRepo.get().features;
  const routes: RouteObject[] = getAvailableRoutes().routes.map((r) => ({
    key: r.slug,
    path: getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug),
    element: <Suspense fallback={<FullScreenLoader />}>{r.view}</Suspense>,
  }));

  routes.push({ path: '*', element: <div>404</div> });

  // TODO: showAboutForNewUsers(); via https://reactrouter.com/en/dev/fetch/redirect

  return [
    {
      path: '/',
      element: <Layout />,
      children: routes,
    },
  ];
}

function FullScreenLoader() {
  return (
    <div style={{ flex: 1 }}>
      <LoadingSpinner message={null} />
    </div>
  );
}
