import appConfig from '~core/app_config';

const trimSlash = (str: string) => {
  return str.replace(/^\/|\/$/g, '');
};

const pathJoin = (...path: Array<string>) => {
  return path
    .map(trimSlash)
    .filter((path) => path.length !== 0)
    .join('/');
};

export const getAbsoluteRoute = (slug: string, base = appConfig.baseUrl) => {
  return '/' + pathJoin(base, slug);
};
