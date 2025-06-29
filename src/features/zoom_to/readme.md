## Zoom to selected area

This feature adds a button to the toolbar that zooms the map to the currently selected area.

### How to use

```ts
import('~features/zoom_to').then(({ initZoomTo }) => {
  initZoomTo();
});
```

### How it works

The feature reads geometry from `focusedGeometryAtom`. When the button is pressed it calculates a bounding box for this geometry and fits the map to it. The button is disabled when there is no selected area.
