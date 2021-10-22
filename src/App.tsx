import { StrictMode, Suspense } from 'react';
import ReactDOM from 'react-dom';
import MainView from '~views/Main/Main';
import { Reports } from '~views/Reports/Reports';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import styles from './views/Main/Main.module.css';

ReactDOM.render(
  <Router>
    <StrictMode>
      <CacheSwitch>
        <CacheRoute className={styles.mainWrap} exact path="/">
          <MainView />
        </CacheRoute>

        <Route path="/reports">
          <Suspense fallback={null}>
            <Reports />
          </Suspense>
        </Route>

        {/* insted of 404 */}
        <Route path="/">
          <Redirect to="/" />
        </Route>
      </CacheSwitch>
    </StrictMode>
  </Router>,

  document.getElementById('root'),
);
