## Focused geometry layer

Focused geometry - describe current area of interest.
This is one of the global application filters that used in other api requests
When you need to draw this geometry on map - use this feature.
It read current focused geometry state, generates layer and legend for it.

### How to use

```ts
import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
  initFocusedGeometryLayer(),
);
```

### How it works

`initFocusedGeometryLayer`:

1. create logical layer with it's own legend, and renderer
2. create atom that watching on the focusedGeometry and set it geometry as geojson source for logical layer created on first step
3. when focused geometry is an event, update layer name and legend to "<EventType>: <EventName>"
