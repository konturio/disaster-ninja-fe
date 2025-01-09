# Test Patterns

## Core Test Structure

```typescript
describe('Feature', () => {
  beforeEach(async (context) => {
    // Use test context for setup
    context.ctx = await createContext();
  });

  test('should handle success case', async ({ ctx }) => {
    // 1. Setup using factories
    await MockFactory.setupSuccessfulAuth({
      baseUrl: ctx.baseUrl,
      realm: ctx.keycloakRealm,
    });

    // 2. Execute
    const result = await ctx.authClient.operation();

    // 3. Verify
    expect(result).toEqual(expected);
  });
});
```

## Factory Pattern Usage

### Test Context Setup

```typescript
// Create shared test context
const ctx = await createContext();
// Access shared resources
const { authClient, token, localStorageMock } = ctx;
```

### Token Generation

```typescript
// Create tokens using TokenFactory
const token = await TokenFactory.createToken();
const expiredToken = await TokenFactory.createExpiredToken();
const refreshToken = await TokenFactory.createRefreshToken();
```

### Mock Setup

```typescript
// Reset all mocks first
MockFactory.resetMocks();

// Setup auth endpoints
await MockFactory.setupSuccessfulAuth(config);
MockFactory.setupFailedAuth(config);
MockFactory.setupLogoutEndpoint(config);

// Setup API endpoints
MockFactory.setupSuccessfulResponse('/test', data);
MockFactory.setupApiError('/test', error);
```

## Real-World Testing Patterns

### Concurrent Operations

```typescript
test('should handle concurrent requests', async ({ ctx }) => {
  // Setup expired token state
  const requests = Array(5)
    .fill(null)
    .map(() => ctx.authClient.getAccessToken());
  const results = await Promise.all(requests);

  // Verify single refresh occurred
  expect(new Set(results).size).toBe(1);
});
```

### Storage Limitations

```typescript
test('should handle storage errors', async ({ ctx }) => {
  vi.spyOn(ctx.localStorageMock, 'setItem').mockImplementation(() => {
    throw new Error('QuotaExceededError');
  });

  await expect(operation()).rejects.toThrow();
});
```

## Best Practices

1. **Test Context**

   - Use `createContext()` for consistent setup
   - Access shared resources via context
   - Reset state in `beforeEach`

2. **Factory Usage**

   - Use `TokenFactory` for JWT operations
   - Use `MockFactory` for endpoint mocks
   - Use `ClientFactory` for client creation

3. **Coverage Strategy**

   - Target 80% for library code
   - Focus on real-world scenarios first
   - Add edge cases based on customer needs

4. **Mock Management**
   - Always call `MockFactory.resetMocks()`
   - Use factory methods over direct mocks
   - Setup all required endpoints

## Common Patterns

1. **Auth Flow Testing**

   ```typescript
   // Success flow
   await MockFactory.setupSuccessfulAuth(config);
   const result = await ctx.authClient.login();
   expect(result).toBe(true);

   // Error flow
   MockFactory.setupFailedAuth(config);
   const error = await ctx.authClient.login().catch((e) => e);
   expect(error.kind).toBe('unauthorized');
   ```

2. **Token Refresh Testing**

   ```typescript
   // Force refresh
   vi.spyOn(client, 'shouldRefreshToken').mockReturnValue(AUTH_REQUIREMENT.MUST);

   // Preemptive refresh
   vi.spyOn(client, 'shouldRefreshToken').mockReturnValue(AUTH_REQUIREMENT.SHOULD);
   ```

3. **Error Handling**

   ```typescript
   // API errors
   MockFactory.setupApiError('/path', {
     kind: 'not-found',
     message: 'Resource not found',
   });

   // Network errors
   MockFactory.setupNetworkError('/path');
   ```

## Common Gotchas

1. **Context Setup**

   - Always await `createContext()`
   - Reset mocks before setup
   - Clear storage state

2. **Token Management**

   - Use proper token expiration
   - Handle refresh token expiry
   - Test both forced and preemptive refresh

3. **Mock Cleanup**
   - Reset mocks between tests
   - Clear spy implementations
   - Restore storage state

## Retry Behavior Testing

### Test Setup

```typescript
test('should retry on timeout', async ({ ctx }) => {
  // 1. Reset mocks for clean state
  MockFactory.resetMocks();

  // 2. Mock the wait function to avoid real delays
  const waitSpy = vi
    .spyOn(waitModule, 'wait')
    .mockImplementation(() => Promise.resolve());

  try {
    // 3. Setup sequential responses
    MockFactory.setupSequentialResponses('/test', [
      new ApiClientError('Request Timeout', {
        kind: 'timeout',
        temporary: true,
      }),
      { status: 200, body: { data: 'success' } },
    ]);

    // 4. Execute with retry config
    const result = await ctx.apiClient.get('/test', undefined, {
      retry: { attempts: 1, delayMs: 100 },
    });

    // 5. Verify behavior
    expect(result).toEqual({ data: 'success' });
    expect(MockFactory.getCallCount()).toBe(2);
    expect(waitSpy).toHaveBeenCalledWith(0.1); // 100ms = 0.1s
  } finally {
    // 6. Clean up
    waitSpy.mockRestore();
  }
});
```

### Key Testing Patterns

1. **Delay Mocking**

   - Mock the `wait` function to avoid real delays
   - Convert milliseconds to seconds (e.g., 100ms → 0.1s)
   - Verify exact delay values used

2. **Sequential Responses**

   - Use `MockFactory.setupSequentialResponses` for retry scenarios
   - First response triggers retry (e.g., timeout)
   - Second response determines final outcome

3. **Verification Points**
   - Check final result matches expected data
   - Verify correct number of attempts made
   - Confirm correct delay values used

### Common Retry Scenarios

1. **Default Behavior**

   ```typescript
   // Only retries on timeout by default
   MockFactory.setupApiError('/test', {
     kind: 'timeout',
     temporary: true,
   });
   ```

2. **Custom Error Types**

   ```typescript
   // Retry on specific error kinds
   ctx.apiClient.get('/test', undefined, {
     retry: {
       attempts: 1,
       onErrorKinds: ['timeout', 'server'],
     },
   });
   ```

3. **Retry Limits**
   ```typescript
   // Respect maximum attempts
   MockFactory.setupSequentialResponses('/test', [
     timeoutError,
     timeoutError,
     timeoutError,
   ]);
   ```

### Best Practices

1. **Test Speed**

   - Mock timing functions to avoid real delays
   - Use shorter delays in tests (100ms vs 1000ms)
   - Verify timing without waiting

2. **Test Reliability**

   - Avoid real timers to prevent flaky tests
   - Use deterministic mocks for consistent behavior
   - Clean up mocks after each test

3. **Coverage**
   - Test default retry configuration
   - Verify custom retry settings
   - Include error scenarios during retries

### Common Gotchas

1. **Timing**

   - Remember `wait` function uses seconds, not milliseconds
   - Convert delay values appropriately (ms / 1000)
   - Clean up timing mocks to avoid test interference

2. **Mock Setup**

   - Reset mocks before setting up sequences
   - Provide enough responses for all retries
   - Include both success and failure cases

3. **Verification**
   - Check both successful retries and failures
   - Verify exact number of attempts made
   - Confirm correct delay values used
