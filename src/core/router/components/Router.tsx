import { CacheSwitch } from 'react-router-cache-route';
import { Router as ReactRouter } from 'react-router-dom';
import { CommonView } from '~views/CommonView';
import { availableRoutesAtom } from '../atoms/availableRoutes';
import { currentRouteAtom } from '../atoms/currentRoute';
import { getAbsoluteRoute } from '../getAbsoluteRoute';
import history from '../history';
import { Routes } from './Routes';

export function Router() {
  return (
    <ReactRouter history={history}>
      <CommonView
        availableRoutesAtom={availableRoutesAtom}
        currentRouteAtom={currentRouteAtom}
        getAbsoluteRoute={getAbsoluteRoute}
      >
        <CacheSwitch>
          <Routes />
        </CacheSwitch>
      </CommonView>
    </ReactRouter>
  );
}
