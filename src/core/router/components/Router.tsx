import { CacheSwitch } from 'react-router-cache-route';
import { Router as ReactRouter } from 'react-router-dom';
import history from '~core/history';
import { Routes } from './Routes';

export function Router() {
  return (
    <ReactRouter history={history}>
      <CacheSwitch>
        <Routes />
      </CacheSwitch>
    </ReactRouter>
  );
}
