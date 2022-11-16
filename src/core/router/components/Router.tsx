import { CacheSwitch } from 'react-router-cache-route';
import { Router as ReactRouter, Route, Redirect } from 'react-router-dom';
import history from '~core/history';
import { CommonRoutesFeatures } from '~views/Common';
import { Routes } from './Routes';

export function Router() {
  return (
    <ReactRouter history={history}>
      <CommonRoutesFeatures>
        <CacheSwitch>
          <Routes />
        </CacheSwitch>
      </CommonRoutesFeatures>
    </ReactRouter>
  );
}
