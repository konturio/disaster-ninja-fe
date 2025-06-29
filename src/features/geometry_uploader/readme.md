## Geometry uploader

This feature adds button to the toolbar, click on that button allows user to upload geometry (pass it to `focusedGeometryAtom`) and work with it - get analytics, get visualization, modify it and other stuff

### How to use

Run `initFileUploader` expoted from the index file once

```ts
import('~features/geometry_uploader').then(({ initFileUploader }) => initFileUploader());
```

### How it works

`initFileUploader` adds button to the toolbar (`toolbarControlsAtom`) and describes behavior on button click.
On button click function `askGeoJSONFile` executed. It shows error toast if error occurred and executes callback if geojson was passed successfully.
Success callback passes the uploaded geometry to apps `focusedGeometryAtom` and focuses on on it.

The implementation might look quirky, it's done this way to support Safari browsers.

### Interactions with other tools

The upload button becomes disabled while map ruler, boundary selector or focused
geometry editing tools are active. It returns to regular state once those tools
are deactivated.
