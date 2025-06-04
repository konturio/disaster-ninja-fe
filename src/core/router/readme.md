# Router

The router is responsible for building a set of available routes based on feature flags and user state. Each route is described in `routes.tsx` with an optional feature flag requirement. During application startup the router performs an initial redirect to make sure the user lands on a meaningful page.

The router defines a `loginRedirectOrder` constant that lists route ids in the order they should be considered when redirecting the user right after login.

## Initial navigation logic

1. **Just logged in** – `OidcSimpleClient` stores a `justLoggedIn` flag in `sessionStorage` right before the page reload, and on the next load, the router checks this flag and chooses one of the available routes in the following order: map, pricing, profile. The flag is then removed.
2. **Root URL** – if the user opens `/` directly the router redirects to the configured default route (usually `map`).
3. **Landing page** – first time visitors can be redirected to the landing page if the feature is enabled.
4. **No access to map** – authenticated users without access to the map feature are redirected to pricing when opening the root URL.

For all other cases, the router preserves the current URL on reload without additional redirects.
