import { describe, it, expect, beforeEach } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import { replaceUrlWithProxyMock } from './mocks/replaceUrlWithProxy.mock';
import type { TestContext } from './_clientTestsContext';

describe('ApiClient URL Handling', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createContext();
    MockFactory.resetMocks();
    await MockFactory.setupSuccessfulAuth();
    MockFactory.setupOidcConfiguration();
  });

  it('should handle absolute URLs', async () => {
    const absoluteUrl = 'http://example.com/api/test';
    const data = { data: 'test' };

    MockFactory.setupSuccessfulResponse(absoluteUrl, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get(absoluteUrl);
    expect(response).toEqual(data);
  });

  it('should handle relative URLs', async () => {
    const data = { data: 'test' };
    MockFactory.setupSuccessfulResponse('/test', data, { method: 'get' });

    const response = await context.apiClient.get('/test');
    expect(response).toEqual(data);
  });

  it('should handle URLs with query parameters', async () => {
    const data = { data: 'test' };
    const params = { param: 'value' };
    const url = 'http://localhost:8080/api/test?param=value';

    MockFactory.setupSuccessfulResponse(url, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get('/test', params);
    expect(response).toEqual(data);
  });

  it('should handle URLs with special characters', async () => {
    const path = '/test/special chars & symbols';
    const data = { data: 'test' };

    MockFactory.setupSuccessfulResponse(path, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get(path);
    expect(response).toEqual(data);
  });

  it('should handle proxy URLs in development', async () => {
    const baseUrl = 'http://localhost:8080/api';
    const data = { data: 'test' };

    replaceUrlWithProxyMock.mockImplementation((url) => url);
    MockFactory.setupSuccessfulResponse('/test', data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get('/test');
    expect(response).toEqual(data);
    expect(replaceUrlWithProxyMock).toHaveBeenCalled();
    const lastCall = replaceUrlWithProxyMock.mock.lastCall;
    expect(lastCall).toBeDefined();
    expect(lastCall?.[0]).toBe(baseUrl);
  });

  it('should handle URLs with multiple query parameters', async () => {
    const params = { foo: 'bar', baz: '123', qux: 'true' };
    const data = { data: 'test' };
    const url = 'http://localhost:8080/api/test?foo=bar&baz=123&qux=true';

    MockFactory.setupSuccessfulResponse(url, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get('/test', params);
    expect(response).toEqual(data);
  });

  it('should handle URLs with array parameters', async () => {
    const params = { items: ['a', 'b', 'c'] };
    const data = { data: 'test' };
    const url = 'http://localhost:8080/api/test?items=a&items=b&items=c';

    MockFactory.setupSuccessfulResponse(url, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get('/test', params);
    expect(response).toEqual(data);
  });

  it('should handle URLs with encoded parameters', async () => {
    const params = { q: 'hello world', tag: '#test' };
    const data = { data: 'test' };
    const url = 'http://localhost:8080/api/test?q=hello+world&tag=%23test';

    MockFactory.setupSuccessfulResponse(url, data, {
      method: 'get',
      once: true,
    });

    const response = await context.apiClient.get('/test', params);
    expect(response).toEqual(data);
  });
});
