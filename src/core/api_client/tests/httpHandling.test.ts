/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import type { TestContext } from './_clientTestsContext';

describe('ApiClient HTTP Handling', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createContext();
  });

  describe('Request Bodies', () => {
    const testData = { message: 'test data' };

    it('should send JSON body with POST request', async () => {
      const requestBody = { input: 'test' };
      MockFactory.setupSuccessfulResponse('/data', testData, { method: 'post' });
      const response = await context.apiClient.post('/data', requestBody);
      expect(response).toEqual(testData);
    });

    it('should send JSON body with PUT request', async () => {
      const requestBody = { input: 'test' };
      MockFactory.setupSuccessfulResponse('/data', testData, { method: 'put' });
      const response = await context.apiClient.put('/data', requestBody);
      expect(response).toEqual(testData);
    });

    it('should send partial JSON body with PATCH request', async () => {
      const requestBody = { input: 'test' };
      MockFactory.setupSuccessfulResponse('/data', testData, { method: 'patch' });
      const response = await context.apiClient.patch('/data', requestBody);
      expect(response).toEqual(testData);
    });

    it('should handle empty request body', async () => {
      MockFactory.setupSuccessfulResponse('/data', testData, { method: 'post' });
      const response = await context.apiClient.post('/data');
      expect(response).toEqual(testData);
    });

    it('should handle complex nested request body', async () => {
      const requestBody = {
        user: {
          name: 'test',
          settings: {
            theme: 'dark',
            notifications: true,
          },
          tags: ['a', 'b', 'c'],
        },
      };
      MockFactory.setupSuccessfulResponse('/data', testData, { method: 'post' });
      const response = await context.apiClient.post('/data', requestBody);
      expect(response).toEqual(testData);
    });
  });

  describe('HTTP Headers', () => {
    const testData = { message: 'test data' };

    it('should send custom headers with request', async () => {
      const customHeaders = { 'X-Custom-Header': 'test' };
      MockFactory.setupSuccessfulResponse('/data', testData, {
        method: 'get',
        headers: customHeaders,
      });

      const response = await context.apiClient.get('/data', undefined, {
        headers: customHeaders,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(response).toEqual(testData);
    });

    it('should handle content-type headers', async () => {
      const headers = { 'Content-Type': 'application/json' };
      MockFactory.setupSuccessfulResponse('/data', testData, {
        method: 'post',
        headers,
      });

      const response = await context.apiClient.post(
        '/data',
        { data: 'test' },
        {
          headers,
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      );
      expect(response).toEqual(testData);
    });

    it('should handle multiple custom headers', async () => {
      const headers = {
        'X-Custom-Header-1': 'test1',
        'X-Custom-Header-2': 'test2',
        'X-Custom-Header-3': 'test3',
      };
      MockFactory.setupSuccessfulResponse('/data', testData, {
        method: 'get',
        headers,
      });

      const response = await context.apiClient.get('/data', undefined, {
        headers,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(response).toEqual(testData);
    });

    it('should handle authorization header', async () => {
      const headers = { Authorization: 'Bearer test-token' };
      MockFactory.setupSuccessfulResponse('/data', testData, {
        method: 'get',
        headers,
      });

      const response = await context.apiClient.get('/data', undefined, {
        headers,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(response).toEqual(testData);
    });
  });
});
