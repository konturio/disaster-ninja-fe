import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
import { KeepAliveProvider } from 'react-component-keepalive-ts';
import { Suspense } from 'react';
import { postInit } from '~core/postInit';
import { CommonView } from '~views/CommonView';
import { configRepo } from '~core/config';
import { FullScreenLoader } from '~components/LoadingSpinner/LoadingSpinner';
import { landUser, userWasLanded } from '~core/auth/atoms/userWasLanded';
import { availableRoutesAtom, getAvailableRoutes } from '../atoms/availableRoutes';
import { currentRouteAtom } from '../atoms/currentRoute';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { NAVIGATE_EVENT } from '../goTo';
import { currentLocationAtom } from '../atoms/currentLocation';

export const routerInstance = initRouter();

// sync currentLocationAtom with react-router-dom
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

export function initRouter() {
  const availableRoutes = getAvailableRoutes();
  const { defaultRoute } = availableRoutes;
  const routes: RouteObject[] = availableRoutes.routes.map((r) => ({
    id: r.id,
    path: getAbsoluteRoute(r.parentRouteId ? `${r.parentRouteId}/${r.slug}` : r.slug),
    element: <Suspense fallback={<FullScreenLoader />}>{r.view}</Suspense>,
  }));

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <Layout />,
        children: routes,
      },
    ],
    {
      basename: configRepo.get().baseUrl,
    },
  );

  let initialRedirect: string | false = false;

  if (router.state.matches.length < 2) {
    // if we are on root /, redirect to default child route
    // router.state.matches[1] is Layout route, router.state.matches[2] etc will be actual app pages
    initialRedirect = defaultRoute;
  }

  // show landing page
  if (configRepo.get().features['about_page'] && !userWasLanded()) {
    const landingPageRoute = availableRoutes.routes.find((r) => r.showForNewUsers);

    // redirect to landing page if user is new and feature is enabled
    initialRedirect = landingPageRoute?.slug as string;
    landUser();
  }

  if (initialRedirect !== false) {
    router.navigate(getAbsoluteRoute(initialRedirect));
  }

  // Run last parts of app init requiring router
  postInit(router?.state?.matches?.at(1)?.route.id ?? '');

  return router;
}
