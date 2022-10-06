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
  if (path.includes('event')) return 'event';
  if (path.includes('reports')) return 'reports';
  if (path.includes('bivariate-manager')) return 'bivariateManager';
  if (path.includes('about')) return 'about';
  return 'map';
}
