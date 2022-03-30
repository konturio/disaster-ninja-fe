import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import styles from './views/Main/Main.module.css';
import config from '~core/app_config';
import { OriginalLogo } from '~components/KonturLogo/KonturLogo';
import { useAtom } from '@reatom/react';
import { userResourceAtom } from '~core/auth';
import { LoginForm } from '~features/user_profile';

const { MainView } = lazily(() => import('~views/Main/Main'));
const { Reports } = lazily(() => import('~views/Reports/Reports'));
const { ReportPage } = lazily(() => import('~views/Report/Report'));

export function RoutedApp() {
  const [{ loading }] = useAtom(userResourceAtom);
  return (
    <StrictMode>
      <OriginalLogo />
      {!loading ? (
        <Router>
          <CacheSwitch>
            <CacheRoute className={styles.mainWrap} exact path={config.baseUrl}>
              <Suspense fallback={null}>
                <MainView />
              </Suspense>
            </CacheRoute>

            <Route exact path={config.baseUrl + 'reports'}>
              <Suspense fallback={null}>
                <Reports />
              </Suspense>
            </Route>

            <Route path={config.baseUrl + 'reports/:reportId'}>
              <Suspense fallback={null}>
                <ReportPage />
              </Suspense>
            </Route>
          </CacheSwitch>
        </Router>
      ) : null}
      <LoginForm />
    </StrictMode>
  );
}
