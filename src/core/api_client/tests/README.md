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

### Network Failures

```typescript
test('should handle network errors', async ({ ctx }) => {
  MockFactory.setupNetworkError('/endpoint');

  const error = await ctx.authClient.operation().catch((e) => e);

  expect(error.problem.kind).toBe('cannot-connect');
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
   vi.spyOn(client, 'shouldRefreshToken').mockReturnValue('must');

   // Preemptive refresh
   vi.spyOn(client, 'shouldRefreshToken').mockReturnValue('should');
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
