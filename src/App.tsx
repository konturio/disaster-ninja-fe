import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import MainView from '~views/Main/Main';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Reports } from '~views/Reports/Reports';

ReactDOM.render(
  <StrictMode>
    <Router>
      {/* вум */}
      <ul>
        <li>
          <Link to="/">Map</Link>
        </li>
        <li>
          <Link to="/reports">Reports</Link>
        </li>
      </ul>

      <CacheSwitch>
        <Route exact path="/">
          <MainView />
        </Route>
        <Route path="/reports">
          <Reports />
        </Route>
      </CacheSwitch>
    </Router>
  </StrictMode>,
  document.getElementById('root'),
);
