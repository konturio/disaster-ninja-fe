import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { useAtom } from '@reatom/react';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { LoginForm } from '~features/user_profile';
import { APP_ROUTES } from '~core/app_config/appRoutes';
import s from './views/Main/Main.module.css';
import { CommonRoutesFeatures } from './RoutesWrap';
const { MainView } = lazily(() => import('~views/Main/Main'));
const { Reports } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));
const { BivariateManagerPage } = lazily(
  () => import('~views/BivariateManager/BivariateManager'),
);

export function RoutedApp() {
  const [{ data: userModel, loading }] = useAtom(userResourceAtom);
  return (
    <StrictMode>
      <OriginalLogo />

      <Router>
        <CommonRoutesFeatures userModel={userModel}>
          {userModel && !loading && (
            <CacheSwitch>
              <CacheRoute
                className={s.mainWrap}
                exact
                path={[APP_ROUTES.map, APP_ROUTES.eventExplorer]}
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

              <Route path={APP_ROUTES.reportPage}>
                <Suspense fallback={null}>
                  <ReportPage />
                </Suspense>
              </Route>

              <Route path={APP_ROUTES.bivariateManager}>
                <Suspense fallback={null}>
                  <BivariateManagerPage />
                </Suspense>
              </Route>
              <Redirect to="/" />
            </CacheSwitch>
          )}
        </CommonRoutesFeatures>
      </Router>
      <LoginForm />
    </StrictMode>
  );
}
