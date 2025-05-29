# OAM Authentication Feature

## Overview

The OAM (OpenAerialMap) Authentication feature enables seamless authentication between our application and the embedded OAM iframe application. This feature ensures that users can access authenticated OAM pages while maintaining a unified authentication experience.

## Why This Approach?

The current authentication implementation was developed to solve a specific technical limitation:

1. **Original Problem**:

   - When trying to authenticate directly within the OAM iframe application, Google OAuth flow fails
   - This is due to Google OAuth security policies that restrict authentication in iframes
   - As a result, users couldn't authenticate to OAM when accessing it through our application

2. **Solution**:

   - Authentication flow is now initiated from our main application (outside the iframe)
   - We make requests to OAM's backend to handle the authentication
   - After successful authentication, the session cookie is set and shared between applications
   - This works because both applications are on the same domain (though on different subdomains)
   - The cookie sharing enables seamless access to authenticated OAM content

3. **Benefits**:
   - Bypasses Google OAuth iframe restrictions
   - Provides a seamless authentication experience for users
   - Maintains security while enabling cross-application authentication
   - Single sign-on experience across our application and OAM

## Technical Implementation

### Components

1. `OAMAuthWrapper` (`OAMAuthWrapper.tsx`)

   - A wrapper component that checks for OAM session
   - Periodically verifies authentication status (configurable interval)
   - Shows either the protected content or the authentication button
   - Uses cookie-based session detection

2. `OAMAuthRequired` (`OAMAuthRequired.tsx`)
   - Displays the authentication button when user is not authenticated
   - Uses the configured OAM authentication URL
   - Preserves the original URI for redirect after authentication

### Configuration

The feature is configured through the feature configuration system. All settings are available in the `OAMAuthFeatureConfig`:

```typescript
type OAMAuthFeatureConfig = {
  // Routes that require OAM authentication
  requiredRoutes: string[];

  // OAM authentication endpoint URL
  authUrl: string;

  // Name of the session cookie
  sessionCookieName: string;

  // Interval in milliseconds for checking session status
  sessionCheckIntervalMs: number;

  // Name of the redirect URI parameter in auth URL
  redirectUriParamName: string;
};
```

#### Default Configuration

```json
{
  "features": {
    "oam_auth": {
      "requiredRoutes": ["profile-external", "upload-imagery"],
      "authUrl": "https://api.openaerialmap.org/oauth/google",
      "sessionCookieName": "oam-session",
      "sessionCheckIntervalMs": 30000,
      "redirectUriParamName": "original_uri"
    }
  }
}
```

#### Local Development

For local development, you can override the configuration by creating a `public/config/features.local.json` file:

```json
{
  "oam_auth": {
    "requiredRoutes": ["profile-external", "upload-imagery"],
    "authUrl": "https://api.openaerialmap.org/oauth/google",
    "sessionCookieName": "oam-session",
    "sessionCheckIntervalMs": 5000,
    "redirectUriParamName": "original_uri"
  }
}
```

### Authentication Flow

1. User navigates to a protected OAM route
2. `OAMAuthWrapper` checks if session cookie exists (using configured `sessionCookieName`)
3. If not exists:
   - `OAMAuthRequired` component is shown with login button
   - Clicking the button redirects to auth URL with redirect URI parameter
4. After successful authentication:
   - The session cookie is set from the backend redirect
   - Cookie is shared between applications due to same-domain setup
   - Protected content becomes accessible

### Security Considerations

- Authentication is handled through OAM's OAuth flow
- Session cookie is domain-shared but secure
- Regular session checks (configurable interval) ensure authentication state is current
- Redirect URI is preserved and encoded for secure redirect
- All sensitive configuration is managed through the feature configuration system

## Usage

To protect a route that requires OAM authentication, wrap the content with `OAMAuthWrapper`:

```tsx
import { OAMAuthWrapper } from '~features/oam-auth/components/OAMAuthWrapper';

function ProtectedOAMRoute() {
  return (
    <OAMAuthWrapper>
      <OAMIframeContent />
    </OAMAuthWrapper>
  );
}
```

## Configuration Options

### requiredRoutes

Array of route paths that require OAM authentication. These routes will be protected by the `OAMAuthWrapper`.

### authUrl

The OAM authentication endpoint URL. This is where users will be redirected for authentication.

### sessionCookieName

The name of the cookie used to store the session. This cookie is shared between applications.

### sessionCheckIntervalMs

The interval in milliseconds for checking the session status. Default is 30000 (30 seconds). Can be reduced for development.

### redirectUriParamName

The name of the parameter used in the auth URL for the redirect URI. This is the parameter that tells the auth server where to redirect after successful authentication.
