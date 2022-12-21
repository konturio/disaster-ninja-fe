import appConfig from '~core/app_config';

const trimSlash = (str: string) => {
  if (str.startsWith('/')) {
    str = str.slice(1);
  }
  if (str.endsWith('/')) {
    str = str.slice(0, -1);
  }
  return str;
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
