/**
 * @vitest-environment happy-dom
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { ApiClientError } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';
import type { TestContext } from './_clientTestsContext';
import './mocks/replaceUrlWithProxy.mock';

describe('ApiClient Event Handling', () => {
  let context: TestContext;

  beforeEach(async () => {
    context = await createContext();
    // Reset mocks before each test
    MockFactory.resetMocks();
    // Setup default successful auth
    await MockFactory.setupSuccessfulAuth();
  });

  describe('Event Listeners', () => {
    it('should register and trigger error event listeners', async () => {
      const errorEvents: ApiClientError[] = [];
      const unsubscribe = context.apiClient.on('error', (error) => {
        errorEvents.push(error);
      });

      // Setup error response
      MockFactory.setupApiError(
        '/non-existent',
        {
          kind: 'not-found',
          message: 'Resource not found',
          data: null,
        },
        'get',
      );

      // Trigger an error
      await expect(
        context.apiClient.get('/non-existent', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toThrow();

      expect(errorEvents.length).toBe(1);
      expect(errorEvents[0]).toBeInstanceOf(ApiClientError);

      // Setup another error response
      MockFactory.setupApiError(
        '/another-non-existent',
        {
          kind: 'not-found',
          message: 'Resource not found',
          data: null,
        },
        'get',
      );

      // Test unsubscribe
      unsubscribe();
      await expect(
        context.apiClient.get('/another-non-existent', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toThrow();

      expect(errorEvents.length).toBe(1); // Should not increase after unsubscribe
    });

    it('should register and trigger pool update event listeners', async () => {
      const poolUpdates: Map<string, string>[] = [];
      context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates.push(new Map(pool));
      });

      // Setup successful response
      MockFactory.setupSuccessfulResponse(
        '/test',
        { data: 'success' },
        { method: 'get' },
      );

      // Make a request that will be added to the pool
      const promise = context.apiClient.get('/test', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Should have at least one pool update with pending status
      expect(poolUpdates.length).toBeGreaterThan(0);
      expect(poolUpdates[0].size).toBe(1);
      expect([...poolUpdates[0].values()][0]).toBe('pending');

      await promise;

      // Should have another update when request completes
      expect(poolUpdates.length).toBeGreaterThan(1);
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0);
    });

    it('should handle multiple listeners for the same event', async () => {
      const errors1: ApiClientError[] = [];
      const errors2: ApiClientError[] = [];

      context.apiClient.on('error', (error) => errors1.push(error));
      context.apiClient.on('error', (error) => errors2.push(error));

      // Setup error response
      MockFactory.setupApiError(
        '/non-existent',
        {
          kind: 'not-found',
          message: 'Resource not found',
          data: null,
        },
        'get',
      );

      await expect(
        context.apiClient.get('/non-existent', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toThrow();

      expect(errors1.length).toBe(1);
      expect(errors2.length).toBe(1);
      expect(errors1[0]).toBe(errors2[0]);
    });

    it('should properly remove event listeners', async () => {
      const poolUpdates1: Map<string, string>[] = [];
      const poolUpdates2: Map<string, string>[] = [];

      const unsubscribe1 = context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates1.push(new Map(pool));
      });
      const unsubscribe2 = context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates2.push(new Map(pool));
      });

      // Setup successful responses for each request
      MockFactory.setupSuccessfulResponse(
        '/test1',
        { data: 'success1' },
        { method: 'get' },
      );
      MockFactory.setupSuccessfulResponse(
        '/test2',
        { data: 'success2' },
        { method: 'get' },
      );
      MockFactory.setupSuccessfulResponse(
        '/test3',
        { data: 'success3' },
        { method: 'get' },
      );

      // First request - both listeners should receive updates
      await context.apiClient.get('/test1', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(poolUpdates1.length).toBeGreaterThan(0);
      expect(poolUpdates2.length).toBeGreaterThan(0);

      // Remove first listener
      unsubscribe1();
      const length1 = poolUpdates1.length;
      const length2 = poolUpdates2.length;

      // Second request - only second listener should receive updates
      await context.apiClient.get('/test2', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(poolUpdates1.length).toBe(length1); // Should not increase
      expect(poolUpdates2.length).toBeGreaterThan(length2);

      // Remove second listener
      unsubscribe2();
      const finalLength2 = poolUpdates2.length;

      // Third request - no listeners should receive updates
      await context.apiClient.get('/test3', undefined, {
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });
      expect(poolUpdates1.length).toBe(length1);
      expect(poolUpdates2.length).toBe(finalLength2);
    });
  });

  describe('Request Pool Management', () => {
    it('should track concurrent requests in the pool', async () => {
      const poolUpdates: Map<string, string>[] = [];
      context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates.push(new Map(pool));
      });

      // Setup responses for each request
      MockFactory.setupSuccessfulResponse('/test1', { data: 'get1' }, { method: 'get' });
      MockFactory.setupSuccessfulResponse('/test2', { data: 'post' }, { method: 'post' });
      MockFactory.setupSuccessfulResponse('/test3', { data: 'get2' }, { method: 'get' });

      // Make multiple concurrent requests
      const promises = [
        context.apiClient.get('/test1', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
        context.apiClient.post(
          '/test2',
          { data: 'test' },
          {
            authRequirement: AUTH_REQUIREMENT.OPTIONAL,
          },
        ),
        context.apiClient.get('/test3', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ];

      // Should have pool updates with multiple pending requests
      const pendingPool = poolUpdates.find((pool) => pool.size > 1);
      expect(pendingPool).toBeDefined();
      expect(pendingPool!.size).toBeGreaterThan(1);

      await Promise.all(promises);

      // Pool should be empty after all requests complete
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0);
    });

    it('should handle request cancellation in pool', async () => {
      const poolUpdates: Map<string, string>[] = [];
      context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates.push(new Map(pool));
      });

      // Setup response that will be cancelled
      MockFactory.setupSuccessfulResponse(
        '/test',
        { data: 'success' },
        { method: 'get' },
      );

      const controller = new AbortController();
      const promise = context.apiClient.get('/test', undefined, {
        signal: controller.signal,
        authRequirement: AUTH_REQUIREMENT.OPTIONAL,
      });

      // Cancel the request
      controller.abort();

      await expect(promise).rejects.toThrow();

      // Pool should be empty after cancellation
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0);
    });

    it('should cleanup request pool on errors', async () => {
      const poolUpdates: Map<string, string>[] = [];
      context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates.push(new Map(pool));
      });

      // Setup error response
      MockFactory.setupApiError(
        '/non-existent',
        {
          kind: 'not-found',
          message: 'Resource not found',
          data: null,
        },
        'get',
      );

      // Make a request that will fail
      await expect(
        context.apiClient.get('/non-existent', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toThrow();

      // Pool should be empty after error
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0);
    });

    it('should cleanup request pool on network errors', async () => {
      const poolUpdates: Map<string, string>[] = [];
      context.apiClient.on('poolUpdate', (pool) => {
        poolUpdates.push(new Map(pool));
      });

      // Setup network error
      MockFactory.setupNetworkError('/test', 'get');

      // Make a request that will fail with network error
      await expect(
        context.apiClient.get('/test', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ).rejects.toThrow("Can't connect to server");

      // Pool should be empty after network error
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0);
    });
  });

  describe('Request Pool Events', () => {
    it('should track concurrent requests with pool and idle states', async () => {
      const poolUpdates: Map<string, string>[] = [];
      const idleStates: boolean[] = [];

      // Track pool updates and idle states
      context.apiClient.on('poolUpdate', (pool) => poolUpdates.push(new Map(pool)));
      context.apiClient.on('idle', (state) => idleStates.push(state));

      // Setup responses
      MockFactory.setupSuccessfulResponse(
        '/concurrent1',
        { data: 'success1' },
        { method: 'get' },
      );
      MockFactory.setupSuccessfulResponse(
        '/concurrent2',
        { data: 'success2' },
        { method: 'get' },
      );

      // Make concurrent requests
      const requests = [
        context.apiClient.get('/concurrent1', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
        context.apiClient.get('/concurrent2', undefined, {
          authRequirement: AUTH_REQUIREMENT.OPTIONAL,
        }),
      ];

      await Promise.all(requests);

      // Verify pool states
      expect(poolUpdates.length).toBeGreaterThan(0);
      expect(poolUpdates[0].size).toBe(1); // First request added
      expect(poolUpdates[1].size).toBe(2); // Second request added
      expect(poolUpdates[poolUpdates.length - 1].size).toBe(0); // Final empty pool

      // Verify idle states
      expect(idleStates[0]).toBe(false); // Not idle when requests start
      expect(idleStates[idleStates.length - 1]).toBe(true); // Idle when all complete
    });
  });
});
