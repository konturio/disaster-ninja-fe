## Locate me

As of the time of writing this feature only asks for user geolocation and zooms map to it, if it was received

### How to use

```ts
import('~features/locate_me').then(({ initLocateMe }) => {
  initLocateMe();
});
```

### How it works

It uses `navigator.geolocation.getCurrentPosition` method to ask for user position once and then updates `currentMapPositionAtom` in case of success. Shows error message in case of errors/denial. While the location is being fetched a small spinner is shown in the toolbar button.

If you need to use the feature in the IFRAME embedded mode, make sure to pass `allow="geolocation"` to pass the persmissions from root window to the iframe.
