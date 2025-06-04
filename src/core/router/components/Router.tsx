import {
  RouterProvider,
  createBrowserRouter,
  useLocation,
  useOutlet,
  type RouteObject,
} from 'react-router-dom';
import { Suspense, useMemo, useLayoutEffect } from 'react';
import KeepAlive from 'keepalive-for-react';
import { CommonView } from '~views/CommonView';
import { configRepo } from '~core/config';
import { FullScreenLoader } from '~components/LoadingSpinner/LoadingSpinner';
import { landUser, userWasLanded } from '~core/app/userWasLanded';
import { dispatchMetricsEvent, dispatchMetricsEventOnce } from '~core/metrics/dispatch';
import { availableRoutesAtom, getAvailableRoutes } from '../atoms/availableRoutes';
import { currentRouteAtom } from '../atoms/currentRoute';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import { NAVIGATE_EVENT } from '../goTo';
import { currentLocationAtom } from '../atoms/currentLocation';
import { isAuthenticated, isMapFeatureEnabled } from '../routes';

export const routerInstance = initRouter();

// sync currentLocationAtom with react-router-dom
currentLocationAtom.set.dispatch(routerInstance.state.location);
routerInstance.subscribe((e) => {
  currentLocationAtom.set.dispatch(e.location);
});

globalThis.addEventListener(NAVIGATE_EVENT, ((e: CustomEvent) => {
  const slug = e.detail.payload;
  routerInstance.navigate(getAbsoluteRoute(slug) + globalThis.location.search);
}) as EventListener);

// update Title
currentRouteAtom.v3atom.onChange((ctx, route) => {
  document.title = `${configRepo.get().name} - ${route?.title || ''}`;
  route && dispatchMetricsEvent(`view_${route?.id}`);
});

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
        <OutletWithCache />
        <AppLayoutReadyNotifier />
      </CommonView>
    </>
  );
}

function OutletWithCache() {
  const outlet = useOutlet();
  const location = useLocation();

  const cacheKey = useMemo(() => {
    return location.pathname;
  }, [location]);

  // TODO: #20155 Warning! keepalive-for-react v3.0.2 doesn't work with Strict Mode. https://github.com/irychen/keepalive-for-react/blob/9356667eac5f574a3aac8e254ab29128b61a22ee/README.md
  return <KeepAlive activeCacheKey={cacheKey}>{outlet}</KeepAlive>;
}

function initRouter() {
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
  const justLoggedIn = globalThis.sessionStorage.getItem('justLoggedIn') === 'true';
  if (justLoggedIn) {
    globalThis.sessionStorage.removeItem('justLoggedIn');
    const loginRedirectOrder = ['map', 'pricing', 'profile'];
    const routeId = loginRedirectOrder.find((id) =>
      availableRoutes.routes.find((r) => r.id === id && !r.disabled),
    );
    const foundRoute =
      routeId && availableRoutes.routes.find((r) => r.id === routeId && !r.disabled);
    if (foundRoute) {
      initialRedirect = foundRoute.slug;
    } else {
      initialRedirect = defaultRoute;
    }
  } else if (router.state.matches.length < 2) {
    // if we are on root /, redirect to the default child route
    // router.state.matches[0] is Layout route, router.state.matches[1] etc will be actual app pages
    initialRedirect = defaultRoute;
  }

  // show landing page
  if (configRepo.get().features['about_page'] && !userWasLanded()) {
    // TODO: put initialRedirect in feature config, remove showForNewUsers and routes scan
    const landingPageRoute = availableRoutes.routes.find((r) => r.showForNewUsers);

    // redirect to landing page if user is new and feature is enabled
    initialRedirect = landingPageRoute?.slug as string;
    landUser();
  }

  // if landing redirect is not needed
  // check if user is logged in and doesn't have access to map (means no subscription)
  // and redirect to pricing page
  if (
    initialRedirect === false &&
    !justLoggedIn &&
    isAuthenticated &&
    !isMapFeatureEnabled &&
    router.state.matches.length < 2
  ) {
    const pricingRoute = availableRoutes.routes.find((r) => r.id === 'pricing');
    if (pricingRoute) {
      initialRedirect = pricingRoute.slug;
    }
  }

  // perform initial redirect
  if (initialRedirect !== false) {
    router.navigate(getAbsoluteRoute(initialRedirect) + globalThis.location.search, {});
  }

  // Run last parts of app init requiring router
  import('~core/metrics').then(({ initMetricsOnce }) => {
    initMetricsOnce(configRepo.get().id, router?.state?.matches?.at(1)?.route.id ?? '');
  });

  return router;
}

export function AppLayoutReadyNotifier() {
  useLayoutEffect(() => {
    dispatchMetricsEventOnce('router-layout-ready', {});
  }, []);

  return null;
}
