import { CacheSwitch } from 'react-router-cache-route';
import { Router as ReactRouter } from 'react-router-dom';
import history from '../history';
import { Routes } from './Routes';
import type { PropsWithChildren } from 'react';

export function Router({ children }: PropsWithChildren) {
  return (
    <ReactRouter history={history}>
      {children}
      <CacheSwitch>
        <Routes />
      </CacheSwitch>
    </ReactRouter>
  );
}
