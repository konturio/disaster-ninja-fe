import config from './index';
import type { ApplicationMode } from '~core/modes/currentMode';

export const APP_ROUTES = {
  map: config.baseUrl,
  reports: config.baseUrl + 'reports',
  reportPage: config.baseUrl + 'reports/:reportId',
  bivariateManager: config.baseUrl + 'bivariate-manager',
  eventExplorer: config.baseUrl + 'event',
  about: config.baseUrl + 'about',
};

export function findCurrentMode(path: string): ApplicationMode {
  let mode: ApplicationMode = 'map';
  if (path.indexOf('event') > -1) mode = 'event';
  if (path.indexOf('reports') > -1) mode = 'reports';
  if (path.indexOf('bivariate-manager') > -1) mode = 'bivariateManager';
  if (path.indexOf('about') > -1) mode = 'about';
  return mode;
}
