import { StrictMode, Suspense, useEffect } from 'react';
import { lazily } from 'react-lazily';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { Router, Route, Redirect } from 'react-router-dom';
import { useAtom } from '@reatom/react';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import history from '~core/history';
import config from '~core/app_config';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { urlStoreAtom } from '~core/url_store/atoms/urlStore';
import { forceRun } from '~utils/atoms/forceRun';
import { metricsInit } from '~core/metrics/init';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import { AppFeature } from '~core/auth/types';
import s from './views/Main/Main.module.css';
import { CommonRoutesFeatures } from './RoutesWrap';
const { MainView } = lazily(() => import('~views/Main/Main'));
const { Reports } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { ProfileMode } = lazily(() => import('~views/Profile/Profile'));
const { AboutPage } = lazily(() => import('~views/About/About'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

const initialUrl = new URL(localStorage.getItem('initialUrl') || '');

export function RoutedApp() {
  const [{ data, loading }] = useAtom(userResourceAtom);
  const userModel = data && !loading ? data : null;

  useEffect(() => {
    if (userModel) {
      metricsInit();
    }
  }, [userModel]);

  useEffect(() => forceRun(urlStoreAtom), []);

  useEffect(() => {
    const isFirstTimeVisit = () =>
      userModel &&
      location.pathname === config.baseUrl &&
      initialUrl.search === '' &&
      !localStorage.getItem('landed');

    // redirect first-time visitor "/" -> "/about"
    if (isFirstTimeVisit()) {
      localStorage.setItem('landed', 'true');
      history.push(APP_ROUTES.about);
    }
  }, [userModel]);

  return (
    <StrictMode>
      <OriginalLogo />

      <Router history={history}>
        <CommonRoutesFeatures userModel={userModel}>
          <CacheSwitch>
            <CacheRoute
              exact
              path={[APP_ROUTES.map, APP_ROUTES.eventExplorer]}
              className={s.mainViewWrap}
            >
              <Suspense fallback={null}>
                <MainView userModel={userModel} />
              </Suspense>
            </CacheRoute>

            <Route exact path={APP_ROUTES.reports}>
              <Suspense fallback={null}>
                <Reports />
              </Suspense>
            </Route>

            <Route exact path={APP_ROUTES.about}>
              <Suspense fallback={null}>
                <AboutPage />
              </Suspense>
            </Route>

            <Route path={APP_ROUTES.reportPage}>
              <Suspense fallback={null}>
                <ReportPage />
              </Suspense>
            </Route>

            <Route path={APP_ROUTES.bivariateManager}>
              <Protected
                pass={!!userModel?.hasFeature(AppFeature.BIVARIATE_COLOR_MANAGER)}
              >
                <Suspense fallback={null}>
                  <BivariateManagerPage />
                </Suspense>
              </Protected>
            </Route>

            <Route path={APP_ROUTES.profile}>
              <Suspense fallback={null}>
                <ProfileMode />
              </Suspense>
            </Route>

            <Redirect to={APP_ROUTES.map} />
          </CacheSwitch>
        </CommonRoutesFeatures>
      </Router>
    </StrictMode>
  );
}

export const Protected = ({
  children,
  pass,
}: {
  children: JSX.Element;
  pass: boolean;
}) => {
  if (!pass) {
    return <Redirect to={APP_ROUTES.map} />;
  }
  return children;
};
