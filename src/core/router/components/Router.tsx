import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  type RouteObject,
} from 'react-router-dom';
// @ts-ignore
import { KeepAliveProvider } from 'react-component-keepalive-ts';
import { Suspense } from 'react';
import { PostInit } from '~core/postInit';
import { CommonView } from '~views/CommonView';
import { configRepo } from '~core/config';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { landUser, userWasLanded } from '~core/auth/atoms/userWasLanded';
import { availableRoutesAtom, getAvailableRoutes } from '../atoms/availableRoutes';
import { currentRouteAtom } from '../atoms/currentRoute';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { NAVIGATE_EVENT } from '../goTo';
import { currentLocationAtom } from '../atoms/currentLocation';

export const routerInstance = initRoouter();

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

export function initRoouter() {
  const availableRoutes = getAvailableRoutes();
  const { defaultRoute } = availableRoutes;
  const routes: RouteObject[] = availableRoutes.routes.map((r) => ({
    id: r.slug,
    path: getAbsoluteRoute(r.parentRoute ? `${r.parentRoute}/${r.slug}` : r.slug),
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
    const greetingsRoute = availableRoutes.routes.find((r) => r.showForNewUsers);

    // redirect to landing page if user is new and feature is enabled
    initialRedirect = greetingsRoute?.slug as string;
    landUser();
  }

  if (initialRedirect !== false) {
    router.navigate(getAbsoluteRoute(initialRedirect));
  }

  return router;
}

function FullScreenLoader() {
  return (
    <div style={{ flex: 1 }}>
      <LoadingSpinner message={null} />
    </div>
  );
}
