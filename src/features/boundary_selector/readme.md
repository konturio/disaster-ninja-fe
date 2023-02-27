## Boundary selector

This feature allows us to set `focusedGeometry` (a.k.a Selected area) by using administrative boundaries.

### How to use

```ts
import('~features/boundary_selector').then(({ initBoundarySelector }) =>
  initBoundarySelector(),
);
```

### How it works

`clickCoordinatesAtom` - listens to clicks on the map and records coordinates
Additionally disables all interactive map mechanics by default while it works

when in changes `boundaryResourceAtom` - sends requests to the API to get available boundaries by click coordinates

`highlightedGeometryAtom` - stores the geometry we want to select while the user selects the boundaries

`boundaryRegistryAtom` - Binds `highlightedGeometryAtom` to `BoundarySelectorRenderer`.
This is similar to the local implementation of the common registry of logical layers, but only for boundary layers.
The common registry is not used because these layers are "private" - in terms of accessibility from other parts of the application.

`boundaryMarkerAtom` - Main controller of this feature. Responsibility:

- Create a drop-down list as a marker on the map by position from `clickCoordinatesAtom`
- Show boundaries names from `boundaryResourceAtom` inside the drop-down list and related contours on the map
- Panning the map to the selected geometry
- When the user makes the final choice - update `focusedGeometry`
