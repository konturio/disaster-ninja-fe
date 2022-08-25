import config from './index';

export const APP_ROUTES = {
  base: config.baseUrl,
  reports: config.baseUrl + 'reports',
  reportPage: config.baseUrl + 'reports/:reportId',
  bivariateManager: config.baseUrl + 'bivariate-manager',
};
