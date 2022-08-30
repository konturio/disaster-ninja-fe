import config from '~core/app_config';

export const ROUTE_PATHS = {
  base: config.baseUrl,
  reports: config.baseUrl + 'reports',
  reportPage: config.baseUrl + 'reports/:reportId',
  bivariateManager: config.baseUrl + 'bivariate-manager',
};
