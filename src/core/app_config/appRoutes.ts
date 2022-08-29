import config from './index';
import type { ApplicationMode } from '~core/modes/currentMode';

export const APP_ROUTES = {
  map: config.baseUrl,
  reports: config.baseUrl + 'reports',
  reportPage: config.baseUrl + 'reports/:reportId',
  bivariateManager: config.baseUrl + 'bivariate-manager',
  eventExplorer: config.baseUrl + 'event',
};

export function findCurrentMode(path: string) {
  let mode: ApplicationMode = 'map';
  if (path.indexOf('event') > -1) mode = 'events';
  if (path.indexOf('reports') > -1) mode = 'reports';
  return mode;
}
