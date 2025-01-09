/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { AUTH_REQUIREMENT } from '~core/auth/constants';
import { isApiError, getApiErrorKind } from '../apiClientError';
import { createContext } from './_clientTestsContext';
import { MockFactory } from './factories/mock.factory';

describe('ApiClient Authorization', () => {
  beforeEach(async (context) => {
    // 1. Create context
    context.ctx = await createContext();
    // 2. Reset all mocks
    MockFactory.resetMocks();
    // 3. Setup default endpoints
    MockFactory.setupOidcConfiguration({
      baseUrl: context.ctx.baseUrl,
      realm: context.ctx.keycloakRealm,
    });
  });

  it('should handle unauthorized errors', async ({ ctx }) => {
    const error = await ctx.apiClient
      .get('/protected', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('unauthorized');
  });

  it('should handle token refresh failures', async ({ ctx }) => {
    MockFactory.setupFailedAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    const error = await ctx.apiClient
      .get('/protected', undefined, {
        authRequirement: AUTH_REQUIREMENT.MUST,
        errorsConfig: { hideErrors: true },
      })
      .catch((e) => e);

    expect(isApiError(error)).toBe(true);
    expect(getApiErrorKind(error)).toBe('unauthorized');
  });
});
