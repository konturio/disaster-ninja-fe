## OSM Edit Link

This feature adds a button to the toolbar. It opens preferred OSM editor with the same zoom and coordinates on the new tab

### How to use

This feature is hooked to the toolbar instance. Once toolbar is presented just run initiating function once

```ts
if (featureFlags[FeatureFlag.OSM_EDIT_LINK]) {
  import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
}
```

### How it works

On the index file it adds control to the toolbar core instance.
On control click current map position being read from `currentMapPositionAtom` and preferred user editor being picked from user info.
That's enough to generate a link. New tab opens with by a new link and becomes focused.

Default JOSM links are opened with the local remote control url `http://127.0.0.1:8111/load_and_zoom`.
