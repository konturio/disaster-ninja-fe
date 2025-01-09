# OidcSimpleClient

A lightweight OpenID Connect client implementation focused on token management and session handling.

## Features

- Token-based authentication with JWT support
- Automatic token refresh management
- Cross-tab session synchronization
- XSS protection for token handling
- Configurable auth requirements (MUST, SHOULD, OPTIONAL)
- Event-based state management

## Usage

```typescript
// Initialize the client
const client = new OidcSimpleClient();
await client.init('https://auth-server.com/realms/my-realm', 'my-client-id');

// Login with username/password
const success = await client.authenticate('username', 'password');

// Get access token for API calls
const token = await client.getAccessToken({
  requirement: 'must', // 'must' | 'should' | 'optional'
});

// Logout
await client.logout();
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant App
    participant Client as OidcSimpleClient
    participant Storage as LocalStorage
    participant Auth as AuthServer

    App->>Client: init(issuerUri, clientId)
    Client->>Storage: checkLocalAuthToken()
    alt Has Valid Token
        Storage-->>Client: Return stored token
        Client->>Auth: Refresh token
        Auth-->>Client: New tokens
        Client->>Storage: Update token state
    else No Valid Token
        Client->>Client: Reset auth state
    end
    Client-->>App: {isAuthenticated, hasExpiredSession}

    Note over App,Auth: Login Flow
    App->>Client: authenticate(username, password)
    Client->>Auth: Request tokens
    Auth-->>Client: Access & refresh tokens
    Client->>Storage: Store tokens
    Client->>App: Reload application
```

## Token Refresh Flow

```mermaid
stateDiagram-v2
    [*] --> CheckToken
    CheckToken --> Valid: Token valid
    CheckToken --> ShouldRefresh: Expires soon
    CheckToken --> MustRefresh: Expired/Missing

    ShouldRefresh --> TryRefresh: Attempt refresh
    TryRefresh --> Valid: Success
    TryRefresh --> UseExisting: Fail but current valid
    TryRefresh --> Invalid: Fail and current invalid

    MustRefresh --> TryRefresh: Has refresh token
    MustRefresh --> Invalid: No refresh token

    Valid --> [*]: Return token
    UseExisting --> [*]: Return current token
    Invalid --> [*]: Reset auth
```

## Session States

```mermaid
stateDiagram-v2
    [*] --> NO_SESSION
    NO_SESSION --> VALID: Login/Init success
    VALID --> EXPIRED: Token expired
    VALID --> REFRESH_NEEDED: Token expiring soon
    VALID --> ERROR: Auth error
    REFRESH_NEEDED --> VALID: Refresh success
    REFRESH_NEEDED --> EXPIRED: Refresh failed
    EXPIRED --> NO_SESSION: Reset auth
    ERROR --> NO_SESSION: Reset auth
```

## Security Features

1. **Token Validation**

   - JWT format verification
   - XSS payload detection
   - Expiration checks
   - Refresh token rotation

2. **Storage Security**
   - Secure token storage in localStorage
   - Cross-tab synchronization
   - Automatic cleanup on session end

## API Reference

### Constructor

```typescript
constructor(
  storage: WindowLocalStorage['localStorage'] = localStorage,
  syncTabs: boolean = false
)
```

### Core Methods

#### `init(issuerUri: string, clientId: string): Promise<AuthState>`

Initializes the client and checks for existing auth state.

#### `authenticate(username: string, password: string): Promise<boolean | string>`

High-level authentication method that handles login and page reload.

#### `getAccessToken(options?: GetAccessTokenOptions): Promise<string>`

Gets the current access token, refreshing if necessary.

#### `logout(doReload?: boolean): Promise<void>`

Ends the current session and optionally reloads the page.

### Types

```typescript
interface AuthState {
  isAuthenticated: boolean;
  hasExpiredSession: boolean;
}

interface GetAccessTokenOptions {
  requirement?: 'must' | 'should' | 'optional';
}

type SessionState = 'NO_SESSION' | 'VALID' | 'EXPIRED' | 'REFRESH_NEEDED' | 'ERROR';
```

## Constants

- `TIME_TO_REFRESH_MS`: 3 minutes (180000ms)
- `LOCALSTORAGE_AUTH_KEY`: 'auth_token'

## Error Handling

The client uses `ApiClientError` for error handling with the following kinds:

- `unauthorized`: Authentication failures
- `bad-data`: Invalid token format or storage issues

## Event System

The client emits `sessionStateChanged` events with the following structure:

```typescript
interface AuthEvent {
  type: AuthEventType;
  reason?: string;
  error?: Error;
  sessionState?: SessionState;
}
```

## Best Practices

1. Always handle authentication errors gracefully
2. Use appropriate auth requirements for API calls
3. Implement proper error handling for storage failures
4. Consider enabling cross-tab synchronization for better UX
5. Handle page reloads appropriately in your application

## Development Notes

1. The client uses the legacy password grant type which is removed in OAuth 2.1
2. Token refresh is handled automatically based on expiration time
3. Cross-tab synchronization is optional but recommended
4. Token validation includes XSS protection measures
5. All token operations are atomic and handle concurrent requests
