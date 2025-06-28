## Locate me

As of the time of writing this feature only asks for user geolocation and zooms map to it, if it was received

### How to use

```ts
import('~features/locate_me').then(({ initLocateMe }) => {
  initLocateMe();
});
```

### How it works

It uses `navigator.geolocation.getCurrentPosition` method to ask for user position once and then updates `currentMapPositionAtom` in case of success. Shows error message in case of errors/denial.

Requesting location also disables automatic focusing on the current event so that the map respects the user's intention to view their own location.

If you need to use the feature in the IFRAME embedded mode, make sure to pass `allow="geolocation"` to pass the persmissions from root window to the iframe.
