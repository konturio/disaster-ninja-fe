import { AxiosInstance } from 'axios';

let mockingEnabled = false;

const mocks = {};

export function addMock(url, data) {
  mocks[url] = data;
}

export function enableMocking(state) {
  mockingEnabled = state;
}

const isUrlMocked = url => url in mocks;

const getMockError = (config, fullUrl) => {
  const mockError = new Error();
  // add extra info to error object
  mockError['mockData'] = mocks[fullUrl];
  mockError['config'] = config;
  return Promise.reject(mockError);
}

const isMockError = error => Boolean(error.mockData);

const getMockResponse = mockError => {
  const {mockData, config} = mockError;
  // Handle mocked error (any non-2xx status code)
  if (mockData.status && String(mockData.status)[0] !== '2') {
    const err = new Error(mockData.message || 'mock error');
    err['code'] = mockData.status;
    return Promise.reject(err);
  }
  // Handle mocked success
  return Promise.resolve(Object.assign({
    data: {},
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
    isMock: true
  }, mockData))
}

function checkUrlIsRelative(url: string): string {
  // if url is relative, add base host
  if (url.startsWith('/') && url.indexOf('http') === -1) {
    return `${location.origin}${url}`;
  }
  return url;
}

export function setupMocking(axiosInstance: AxiosInstance) {
  // Add a request interceptor
  axiosInstance.interceptors.request.use(config => {
    const fullUrl = checkUrlIsRelative(`${config.baseURL || ''}${config.url}`);
    if (mockingEnabled && isUrlMocked(fullUrl)) {
      return getMockError(config, fullUrl)
    }
    return config
  }, error => Promise.reject(error))

  // Add a response interceptor
  axiosInstance.interceptors.response.use(response => response, error => {
    if (isMockError(error)) {
      return getMockResponse(error)
    }
    return Promise.reject(error)
  })

}

