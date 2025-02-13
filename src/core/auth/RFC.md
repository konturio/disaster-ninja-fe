# RFC: Auth State Management Improvements

## Background

Currently, the OidcSimpleClient handles auth state transitions by directly manipulating the browser state (e.g., `location.reload()`, `goTo('/profile')`). This creates tight coupling between auth logic and application behavior, making it harder to test, maintain, and customize.

## Problem

1. Direct browser manipulation in auth client
2. No standardized way to handle auth state transitions
3. Hard to test and customize behavior
4. Cross-tab synchronization issues
5. Tight coupling between auth and application logic

## Proposal

### 1. Event-Based Architecture

```typescript
interface AuthEvent {
  type: 'session_started' | 'session_ended' | 'session_refreshed' | 'auth_error';
  payload: {
    reason?: 'logout' | 'expired' | 'error' | 'invalid_token';
    error?: Error;
    sessionState: SessionState;
  };
}

interface OidcClientConfig {
  eventDispatcher?: (event: AuthEvent) => void | Promise<void>;
}
```

### 2. Usage Examples

```typescript
// Basic usage with navigation
const client = new OidcSimpleClient({
  eventDispatcher: async (event) => {
    switch (event.type) {
      case 'session_started':
        await router.push('/dashboard');
        break;
      case 'session_ended':
        if (event.payload.reason === 'expired') {
          showSessionExpiredNotification();
        }
        await router.push('/login');
        break;
    }
  },
});

// With analytics
const client = new OidcSimpleClient({
  eventDispatcher: (event) => {
    // Track auth events
    analytics.track(`auth_${event.type}`, event.payload);
    // Handle navigation
    handleNavigation(event);
  },
});
```

### 3. Benefits

1. **Separation of Concerns**

   - Auth client handles auth state only
   - Application controls navigation and UI updates
   - Analytics/logging can be added without modifying auth logic

2. **Type Safety**

   - Event types are well-defined
   - Payload structure is consistent
   - Better IDE support and compile-time checks

3. **Testing**

   - Easy to mock event dispatcher
   - Can verify event sequences
   - No need to mock browser APIs

4. **Flexibility**
   - Support multiple event handlers
   - Async event handling
   - Custom navigation strategies

### 4. Migration Strategy

1. Add event dispatcher support to OidcSimpleClient
2. Deprecate direct browser manipulation
3. Update existing code to use event dispatcher
4. Remove direct browser manipulation in next major version

## Alternatives Considered

### 1. Hook-Based Approach

```typescript
interface AuthHooks {
  onSessionStarted?: (event: { isInitial: boolean }) => Promise<void>;
  onSessionEnded?: (event: { reason: string }) => Promise<void>;
}
```

- More explicit but less flexible
- Harder to compose multiple handlers
- More verbose configuration

### 2. DOM Events Only

```typescript
window.dispatchEvent(new CustomEvent('authStateChanged', { detail: event }));
```

- Works across tabs
- Less type safety
- No guaranteed execution order
- Hard to test

### 3. Combined Hooks + Events

- More complex API
- Unclear execution order
- Potential for duplicate handlers

## Decision

We chose the event dispatcher approach because:

1. Similar to established patterns in other OAuth clients
2. Single, flexible extension point
3. Type-safe and testable
4. Easy to migrate to
5. Supports all current use cases

## Implementation Plan

1. Phase 1: Add event dispatcher
2. Phase 2: Update auth state management
3. Phase 3: Deprecate direct browser manipulation
4. Phase 4: Remove deprecated code

## References

1. [RFC 6749 - The OAuth 2.0 Authorization Framework](https://datatracker.ietf.org/doc/html/rfc6749.html)
2. [Google OAuth Client Implementation](https://developers.google.com/identity/protocols/oauth2/javascript-implicit-flow)
3. OIDC-Client-JS library patterns
