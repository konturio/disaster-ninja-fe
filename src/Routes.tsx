import { StrictMode, Suspense } from 'react';
import { lazily } from 'react-lazily';
import { CacheRoute, CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styles from './views/Main/Main.module.css';

const { MainView } = lazily(() => import('~views/Main/Main'));
const { Reports } = lazily(() => import('~views/Reports/Reports'));

export function RoutedApp() {
  return (
    <StrictMode>
      {/* <Router>
        <CacheSwitch>
          <CacheRoute className={styles.mainWrap} exact path="/">
            <Suspense fallback={null}>
              <MainView />
            </Suspense>
          </CacheRoute>

          <Route path="/reports">
            <Suspense fallback={null}>
              <Reports />
            </Suspense>
          </Route>

          <Route path="/">
            <Redirect to="/" />
          </Route>
        </CacheSwitch>
      </Router> */}
      <Suspense fallback={null}>
        <div className={styles.mainWrap}>
          <MainView />
        </div>
      </Suspense>
    </StrictMode>
  );
}
