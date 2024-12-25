import { expect } from 'vitest';
import type { ApiClientError } from '~core/api_client/apiClientError';

/**
 * Asserts that a promise rejects with an ApiClientError of the expected kind and message
 */
export async function expectApiError(
  promise: Promise<any>,
  kind: string,
  message?: string,
) {
  try {
    await promise;
    throw new Error('Expected promise to reject');
  } catch (error) {
    expect(error).toBeInstanceOf(ApiClientError);
    expect((error as ApiClientError).problem.kind).toBe(kind);
    if (message) {
      expect((error as ApiClientError).message).toBe(message);
    }
  }
}

/**
 * Asserts that the last API call had the expected authorization header
 */
export function expectAuthHeader(fetchMock: any, expectedToken: string) {
  const lastCall = fetchMock.callHistory.lastCall();
  const lastCallOptions = lastCall?.options as RequestInit;
  const authHeader =
    lastCallOptions?.headers?.['Authorization'] ||
    lastCallOptions?.headers?.['authorization'];
  expect(authHeader).toBe(`Bearer ${expectedToken}`);
}

/**
 * Waits for a specified number of mock function calls
 */
export async function waitForMockCalls(
  mockFn: { mock: { calls: Array<any> } },
  expectedCalls: number,
  timeoutMs: number = 5000,
): Promise<void> {
  const startTime = Date.now();
  while (mockFn.mock.calls.length < expectedCalls) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error(
        `Timeout waiting for mock to be called ${expectedCalls} times. ` +
          `Current calls: ${mockFn.mock.calls.length}`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Creates a promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Type guard to check if an error is an ApiClientError
 */
export function isApiError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

/**
 * Gets the API error kind from an error object
 */
export function getApiErrorKind(error: unknown): string | undefined {
  return isApiError(error) ? error.problem.kind : undefined;
}

/**
 * Gets the API error message from an error object
 */
export function getApiErrorMessage(error: unknown): string | undefined {
  return isApiError(error) ? error.message : undefined;
}

/**
 * Sets a time offset in seconds from now
 */
export function setTimeOffset(seconds: number): number {
  return Math.floor(Date.now() / 1000) + seconds;
}
