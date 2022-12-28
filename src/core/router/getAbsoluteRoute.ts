import { appConfig } from '~core/app_config';

export const getAbsoluteRoute = (slug: string) =>
  appConfig.baseUrl + (slug.startsWith('/') ? slug.slice(1) : slug);
