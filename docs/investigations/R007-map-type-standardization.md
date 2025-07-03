# R007 - Map Type Standardization Investigation

## Table of Contents

1. Executive Summary
2. System Architecture
3. Implementation Analysis
4. Current Usage Analysis
5. Architectural Inconsistencies
6. System Boundaries

## 1. Executive Summary

This document investigates the current state of map-related type definitions within the codebase, specifically focusing on geographic coordinates (e.g., `LngLat`) and bounding boxes (e.g., `LngLatBoundsLike`). The goal is to identify inconsistencies and propose a standardization approach by centralizing these types within `~core/map/types`, using `GeographicPoint` and a unified `Bbox` type, thereby reducing direct dependencies on `maplibre-gl`'s internal types.

## 2. System Architecture

Currently, map-related geographic types are inconsistently defined and imported across various modules. Some modules directly import `LngLat` or `LngLatBoundsLike` from `maplibre-gl`, while others use custom array types for bounding boxes (`[number, number, number, number]`). The proposed architecture involves establishing `src/core/map/types.ts` as the single source of truth for these fundamental geographic types.

### Proposed Type Definitions:

- **`GeographicPoint`**: For representing longitude and latitude pairs, replacing `maplibre-gl.LngLat`.
  ```typescript
  // src/core/map/types.ts
  export interface GeographicPoint {
    lng: number;
    lat: number;
  }
  ```
- **`Bbox`**: For representing bounding boxes, replacing `maplibre-gl.LngLatBoundsLike` where applicable, and harmonizing existing custom `bbox` array types. This type will be a simple array of four numbers `[west, south, east, north]`.
  ```typescript
  // src/core/map/types.ts
  export type Bbox = [number, number, number, number];
  ```

## 3. Implementation Analysis

The standardization will involve:

- Updating imports: Replacing `import type { LngLat } from 'maplibre-gl';` with `import type { GeographicPoint } from '~core/map/types';`.
- Updating imports: Replacing `import type { LngLatBoundsLike } from 'maplibre-gl';` with `import type { Bbox } from '~core/map/types';`.
- Refactoring function signatures and variable types to use `GeographicPoint` and `Bbox`.
- Ensuring compatibility with `maplibre-gl` APIs by converting to/from `maplibre-gl` types at the boundary points of interaction with the map library.

## 4. Current Usage Analysis

The following files have been identified as directly using `maplibre-gl`'s `LngLat` or `LngLatBoundsLike`, or having inconsistent `bbox` type definitions that could be standardized.

### Files using `LngLat` or `lngLat` property:

- **src/features/boundary_selector/components/BoundarySelectorContentProvider.tsx**:

  ```10:11:src/features/boundary_selector/components/BoundarySelectorContentProvider.tsx
  import type { IMapPopoverContentProvider } from '~core/map/types';
  import type { LngLat } from 'maplibre-gl';
  ```

  ```21:21:src/features/boundary_selector/components/BoundarySelectorContentProvider.tsx
    mapCoordinates: LngLat;
  ```

  _(Note: This file has already been partially refactored in the current session.)_

- **src/utils/map/markers.ts**:

  ```15:15:src/utils/map/markers.ts
  appMarker.setLngLat(marker.coordinates);
  ```

- **src/core/url_store/encoder.ts**:

  ```1:1:src/core/url_store/encoder.ts
  import { isValidLngLat } from '~core/map/utils/coordinateValidation';
  ```

  ```14:14:src/core/url_store/encoder.ts
  if (!isValidLngLat(lng, lat)) return undefined;
  ```

- **src/core/map/utils/coordinateValidation.ts**:

  ```8:8:src/core/map/utils/coordinateValidation.ts
  export function isValidLngLat(lng: number, lat: number): boolean {
  ```

  ```22:27:src/core/map/utils/coordinateValidation.ts
   * @param lngLat - Coordinate pair [longitude, latitude]
   */
  export function isValidLngLatArray(lngLat: [number, number]): boolean {
    const [lng, lat] = lngLat;
    return isValidLngLat(lng, lat);
  ```

- **src/core/map/types.ts**: (This file defines `GeographicPoint` and is the target for `Bbox` definition)

  ```35:35:src/core/map/types.ts
  startTracking: (lngLat: [number, number]) => void;
  ```

  ```46:46:src/core/map/types.ts
  lngLat: GeographicPoint;
  ```

- **src/core/map/hooks/useMapPopoverMaplibreIntegration.ts**:

  ```88:88:src/core/map/hooks/useMapPopoverMaplibreIntegration.ts
  positionTracker.startTracking([event.lngLat.lng, event.lngLat.lat]);
  ```

- **src/core/map/hooks/useMapPositionTracker.ts**:

  ```17:17:src/core/map/hooks/useMapPositionTracker.ts
  const currentLngLatRef = useRef<[number, number] | null>(null);
  ```

  ```24:24:src/core/map/hooks/useMapPositionTracker.ts
  const [lng, lat] = currentLngLatRef.current;
  ```

  ```65:69:src/core/map/hooks/useMapPositionTracker.ts
  (lngLat: [number, number]) => {
    if (!map) return;
    if (!isValidLngLatArray(lngLat)) {
      console.error(`Invalid coordinates for tracking: [${lngLat[0]}, ${lngLat[1]}]`);
  ```

  ```77:77:src/core/map/hooks/useMapPositionTracker.ts
  currentLngLatRef.current = lngLat;
  ```

- **src/core/logical_layers/renderers/GenericRenderer.ts**:

  ```286:286:src/core/logical_layers/renderers/GenericRenderer.ts
  if (!ev || !ev.lngLat) return;
  ```

- **src/core/logical_layers/renderers/activeContributorsLayers.ts**:

  ```23:23:src/core/logical_layers/renderers/activeContributorsLayers.ts
  if (!ev || !ev.lngLat) return;
  ```

- **src/features/breadcrumbs/helpers/breadcrumbsHelpers.ts**:

  ```0:0:src/features/breadcrumbs/helpers/breadcrumbsHelpers.ts
  import { LngLatBounds } from 'maplibre-gl';
  ```

  ```11:11:src/features/breadcrumbs/helpers/breadcrumbsHelpers.ts
  const bounds = new LngLatBounds(position.bbox);
  ```

- **src/components/ConnectedMap/map-libre-adapter/useMarkers.ts**:
  ```19:19:src/components/ConnectedMap/map-libre-adapter/useMarkers.ts
  return new mapLibre.Marker(isReact(m.el) ? renderInline(m.el) : m.el).setLngLat(
  ```

### Files using `LngLatBoundsLike` or `bbox` array types:

- **src/utils/map/camera.ts**:

  ```30:30:src/utils/map/camera.ts
  export function getCameraForBbox(bbox: maplibregl.LngLatBoundsLike, map: maplibregl.Map) {
  ```

  ```17:21:src/utils/map/camera.ts
  let bbox: [number, number, number, number];
  // Turf can return 3d bbox, so we need to cut off potential extra data
  bbox = turfBbox(geojson) as [number, number, number, number];
  bbox.length = 4;
  ```

- **src/utils/geoJSON/helpers.ts**:

  ```1:1:src/utils/geoJSON/helpers.ts
  import type { Position, BBox } from 'geojson';
  ```

  ```81:85:src/utils/geoJSON/helpers.ts
  bbox?: BBox | undefined;
  // ... existing code ...
  constructor(coordinates: Position, bbox?: BBox) {
  // ... existing code ...
  this.bbox = bbox;
  ```

- **src/core/url_store/encoder.ts**:

  ```5:5:src/core/url_store/encoder.ts
  type BBox = [[number, number], [number, number]];
  ```

  ```31:43:src/core/url_store/encoder.ts
  decode: (str: string): BBox => {
  // ... existing code ...
  encode: (bbox: Bbox): string => {
    const normalizedBbox = [
      [bbox[0][0] + 0, bbox[0][1] + 0],
      [bbox[1][0] + 0, bbox[1][1] + 0],
    ]
    return `${normalizedBbox[0][0]},${normalizedBbox[0][1]},${normalizedBbox[1][0]},${normalizedBbox[1][1]}`;
  ```

- **src/core/url_store/types.ts**:

  ```12:12:src/core/url_store/types.ts
  bbox?: [[number, number], [number, number]];
  ```

- **src/core/types/index.ts**:

  ```73:73:src/core/types/index.ts
  bbox: [number, number, number, number];
  ```

- **src/core/shared_state/currentMapPosition.ts**:

  ```13:13:src/core/shared_state/currentMapPosition.ts
  export type Bbox =
  ```

  ```17:17:src/core/shared_state/currentMapPosition.ts
  bbox: Bbox;
  ```

  ```56:57:src/core/shared_state/currentMapPosition.ts
  export const setCurrentMapBbox = action((ctx, bbox: Bbox) => {
    let position = { bbox: bbox.flat() } as MapPosition;
  ```

  ```60:60:src/core/shared_state/currentMapPosition.ts
  const camera = getCameraForBbox(bbox, map);
  ```

- **src/features/layer_features_panel/components/CardElements/index.ts**:

  ```8:9:src/features/layer_features_panel/components/CardElements/index.ts
  import { CardImage } from './CardImage';
  import type { LngLatBoundsLike } from 'maplibre-gl';
  ```

  ```38:38:src/features/layer_features_panel/components/CardElements/index.ts
  focus?: LngLatBoundsLike;
  ```

- **src/features/layer_features_panel/atoms/layerFeaturesFiltersAtom.ts**:

  ```18:29:src/features/layer_features_panel/atoms/layerFeaturesFiltersAtom.ts
  const currentViewBbox = map.getBounds();
  // ... existing code ...
  bbox: [
    currentViewBbox.getNorthEast().toArray()[0],
    currentViewBbox.getNorthEast().toArray()[1],
    currentViewBbox.getSouthEast().toArray()[0],
    currentViewBbox.getSouthEast().toArray()[1],
    currentViewBbox.getSouthWest().toArray()[0],
    currentViewBbox.getSouthWest().toArray()[1],
    currentViewBbox.getNorthWest().toArray()[0],
    currentViewBbox.getNorthWest().toArray()[1],
    currentViewBbox.getNorthEast().toArray()[0],
    currentViewBbox.getNorthEast().toArray()[1],
  ],
  ```

- **src/features/events_list/atoms/eventListFilters.ts**:
  ```13:13:src/features/events_list/atoms/eventListFilters.ts
  bbox: [number, number, number, number] | null;
  ```
  ```19:24:src/features/events_list/atoms/eventListFilters.ts
  const currentViewBbox = map.getBounds().toArray();
  // ... existing code ...
  bbox: [
    currentViewBbox[0][0],
    currentViewBbox[0][1],
  ],
  ```

## 5. Architectural Inconsistencies

The primary inconsistency is the direct reliance on `maplibre-gl` specific types (`LngLat`, `LngLatBoundsLike`) throughout the application, coupled with fragmented custom `bbox` type definitions. This creates a tight coupling with the `maplibre-gl` library, making it harder to swap out the underlying map provider or to reason about geographic data types consistently. Different representations for bounding boxes (e.g., `[number, number, number, number]` vs. `[[number, number], [number, number]]`) also introduce unnecessary complexity and potential for errors.

## 6. System Boundaries

The `maplibre-gl` types should be confined to the `src/components/ConnectedMap/map-libre-adapter` and `src/core/map/providers/MapLibreProvider.ts` modules, which act as the direct interface with the `maplibre-gl` library. All other parts of the application should consume and produce data using the standardized `GeographicPoint` and `Bbox` types from `~core/map/types.ts`. Conversion logic between internal types and `maplibre-gl` types should reside within these boundary layers.

This report serves as a proposal for addressing these inconsistencies and establishing a clearer architectural pattern for handling map-related types.
