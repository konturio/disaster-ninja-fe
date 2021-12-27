import axios from 'axios'

let mockingEnabled = false;

const mocks = {};

export function addMock(url, data) {
  mocks[url] = data;
}

export function enableMocking(state) {
  mockingEnabled = state;
}

const isUrlMocked = url => url in mocks;

const getMockError = config => {
  const mockError = new Error();
  // add extra info to error object
  mockError['mockData'] = mocks[config.url];
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

// Add a request interceptor
axios.interceptors.request.use(config => {
  if (mockingEnabled && isUrlMocked(config.url)) {
    console.log('axios mocking ' + config.url)
    return getMockError(config)
  }
  return config
}, error => Promise.reject(error))

// Add a response interceptor
axios.interceptors.response.use(response => response, error => {
  if (isMockError(error)) {
    return getMockResponse(error)
  }
  return Promise.reject(error)
})
