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
   - We make requests to OAM's backend (`OAM_AUTH_URL`) to handle the authentication
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
   - Periodically verifies authentication status (every 30 seconds)
   - Shows either the protected content or the authentication button
   - Uses cookie-based session detection (`oam-session` cookie)

2. `OAMAuthRequired` (`OAMAuthRequired.tsx`)
   - Displays the authentication button when user is not authenticated
   - Uses the configured OAM authentication URL
   - Preserves the original URI for redirect after authentication

### Configuration

The feature requires two types of configuration:

1. Stage Configuration:

   - `oamAuthUrl`: The OAM authentication endpoint (configured in stage config)
     - Default value: `https://api.openaerialmap.org/oauth/google`
     - Can be overridden through environment configuration

   ```json
   {
     "OAM_AUTH_URL": "https://api.openaerialmap.org/oauth/google"
   }
   ```

2. Feature Configuration (`OAMAuthFeatureConfig`):
   - `requiredRoutes`: Array of route paths that require OAM authentication
   ```json
   {
     "features": {
       "oam_auth": {
         "requiredRoutes": ["/oam/upload", "/oam/manage"]
       }
     }
   }
   ```

### Authentication Flow

1. User navigates to a protected OAM route
2. `OAMAuthWrapper` checks if `oam-session` cookie exsists
3. If not exists:
   - `OAMAuthRequired` component is shown with login button
   - Clicking the button redirects to OAM auth URL with original URI
4. After successful authentication:
   - The OAM `oam-session` cookie sets from the BE redirect to original URI
   - Cookie is shared between applications due to same-domain setup
   - Protected content becomes accessible

### Security Considerations

- Authentication is handled through OAM's OAuth flow
- Session cookie is domain-shared but secure
- Regular session checks (30-second intervals) ensure authentication state is current
- Original URI is preserved and encoded for secure redirect

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
