/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import './mocks/replaceUrlWithProxy.mock';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import { mockWait, resetWaitMock } from './mocks/waitMock';
import type { TestContext } from './_clientTestsContext';

describe('ApiClient HTTP Handling', () => {
  let context: TestContext;
  let waitSpy: ReturnType<typeof mockWait>;

  beforeEach(async () => {
    context = await createContext();
    waitSpy = mockWait();
  });

  afterEach(() => {
    resetWaitMock();
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

  describe('Advanced HTTP Scenarios', () => {
    it('should handle server-side request queueing', async () => {
      type QueueStatus = {
        requestId: string;
        position: number;
        status: 'queued' | 'processing' | 'complete';
      };

      // Setup responses simulating server queue
      MockFactory.setupSequentialResponses(
        '/queued-request',
        [
          {
            status: 200,
            body: {
              requestId: '123',
              position: 2,
              status: 'queued',
            } as QueueStatus,
          },
          {
            status: 200,
            body: {
              requestId: '123',
              position: 1,
              status: 'processing',
            } as QueueStatus,
          },
          {
            status: 200,
            body: {
              requestId: '123',
              position: 0,
              status: 'complete',
            } as QueueStatus,
          },
        ],
        'GET',
      );

      // Poll until complete
      let result: QueueStatus;
      do {
        result = (await context.apiClient.get('/queued-request', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        })) as QueueStatus;
      } while (result.status !== 'complete');

      expect(result.status).toBe('complete');
      expect(result.position).toBe(0);
      expect(MockFactory.getCallCount()).toBe(3); // Initial + 2 status checks
    });

    it('should handle request prioritization', async () => {
      type QueueResponse = {
        tasks: Array<{
          id: number;
          status: string;
          priority: string;
        }>;
      };

      // Setup responses simulating server-side prioritization
      MockFactory.setupSequentialResponses(
        '/priority-queue',
        [
          // First response - tasks queued
          {
            status: 200,
            body: {
              tasks: [
                { id: 1, status: 'processing', priority: 'high' },
                { id: 2, status: 'queued', priority: 'low' },
              ],
            },
          },
          // Second response - high priority complete, low priority processing
          {
            status: 200,
            body: {
              tasks: [
                { id: 1, status: 'complete', priority: 'high' },
                { id: 2, status: 'processing', priority: 'low' },
              ],
            },
          },
          // Final response - all complete
          {
            status: 200,
            body: {
              tasks: [
                { id: 1, status: 'complete', priority: 'high' },
                { id: 2, status: 'complete', priority: 'low' },
              ],
            },
          },
        ],
        'GET',
      );

      // Poll until all tasks complete
      let results: QueueResponse;
      do {
        results = (await context.apiClient.get('/priority-queue', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        })) as QueueResponse;
      } while (results.tasks.some((task) => task.status !== 'complete'));

      expect(results.tasks[0].status).toBe('complete');
      expect(results.tasks[0].priority).toBe('high');
      expect(results.tasks[1].status).toBe('complete');
      expect(results.tasks[1].priority).toBe('low');
    });

    it('should handle batch operations', async () => {
      type BatchResponse = {
        items: Array<{
          id: string;
          status: 'pending' | 'complete';
        }>;
      };

      // Setup batch response
      MockFactory.setupSuccessfulResponse('/batch', {
        items: [
          { id: '1', status: 'complete' },
          { id: '2', status: 'complete' },
        ],
      });

      const result = (await context.apiClient.post(
        '/batch',
        {
          ids: ['1', '2'],
        },
        {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        },
      )) as BatchResponse;

      expect(result.items).toHaveLength(2);
      expect(result.items.every((item) => item.status === 'complete')).toBe(true);
    });

    it('should handle long-running operations with status checks', async () => {
      // Setup responses simulating a long-running operation
      MockFactory.setupSequentialResponses(
        '/long-running',
        [
          // Initial request - accepted, operation started
          {
            status: 202,
            body: {
              operationId: '123',
              status: 'accepted',
            },
          },
          // First status check - still processing
          {
            status: 200,
            body: {
              operationId: '123',
              status: 'processing',
              progress: 50,
            },
          },
          // Final status check - complete
          {
            status: 200,
            body: {
              operationId: '123',
              status: 'complete',
              result: { data: 'operation result' },
            },
          },
        ],
        'GET',
      );

      // Poll until operation complete
      let result;
      do {
        result = await context.apiClient.get('/long-running', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
          retry: {
            attempts: 2,
            onErrorKinds: ['timeout', 'server'],
          },
        });
      } while (result.status !== 'complete');

      expect(result).toEqual({
        operationId: '123',
        status: 'complete',
        result: { data: 'operation result' },
      });
      expect(MockFactory.getCallCount()).toBe(3); // Initial request + 2 status checks
    });
  });
});
