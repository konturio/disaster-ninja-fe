import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import MainView from '~views/Main/Main';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { Reports } from '~views/Reports/Reports';

ReactDOM.render(
  <StrictMode>
    <Router>
      {/* dev */}
      <ul>
        <li>
          <Link to="/">Map</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
      </ul>

      <CacheSwitch>
        <CacheRoute exact path="/">
          <MainView />
        </CacheRoute>
        <Route path="/reports">
          <Reports />
        </Route>
        {/* insted of 404 */}
        <Route path="/">
          <Redirect to="/" />
        </Route>
      </CacheSwitch>
    </Router>
  </StrictMode>,
  document.getElementById('root'),
);
