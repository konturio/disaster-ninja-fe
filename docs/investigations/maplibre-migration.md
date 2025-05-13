# MapLibre GL JS Migration: v3 → v5

## Executive Summary

This document details the migration path from MapLibre GL JS v3 to v5 for the Disaster Ninja FE codebase. It covers breaking changes, code impact, and actionable migration steps, referencing both the [official changelog](https://github.com/maplibre/maplibre-gl-js/blob/main/CHANGELOG.md) and [v5 breaking changes issue](https://github.com/maplibre/maplibre-gl-js/issues/3834).

---

## 1. Breaking Changes in MapLibre v5

**Key breaking changes relevant to this codebase:**

- **`queryTerrainElevation` now returns meters above sea level** ([#3854](https://github.com/maplibre/maplibre-gl-js/pull/3854))
- **New `getElevationOffset` method** for custom 3D object positioning ([#3854](https://github.com/maplibre/maplibre-gl-js/pull/3854))
- **`geometry-type` filter changes**: Multi-features are now properly identified ([style-spec#519](https://github.com/maplibre/maplibre-style-spec/pull/519))
- **Layer ordering and slot changes**: Layer slotting and ordering may affect custom addLayer logic
- **WebGL1 deprecation**: WebGL2 is now the default, with WebGL1 support being phased out ([discussion](https://github.com/maplibre/maplibre-gl-js/issues/3947))
- **Custom layer API**: `CustomRenderMethod` now takes an args object ([#3136](https://github.com/maplibre/maplibre-gl-js/pull/3136#issuecomment-2101231496))
- **Sprite loading**: Order of `normalizeSpriteURL` and `transformRequest` changed ([#3898](https://github.com/maplibre/maplibre-gl-js/pull/3898))
- **Event subscription**: `.on()` now returns a subscription object for unsubscribing ([#5080](https://github.com/maplibre/maplibre-gl-js/pull/5080))
- **Projection and globe**: New projection APIs and globe-related changes ([#4909](https://github.com/maplibre/maplibre-gl-js/issues/4909))
- **Default font**: Default font may change to Noto Sans Regular ([style-spec#436](https://github.com/maplibre/maplibre-style-spec/pull/436))

---

## 2. Code Impact Analysis

### 2.1. Imports and Type Usages

- All direct imports from `maplibre-gl` (default and named) must be checked for API or type changes.
- Type-only imports (e.g., `Map`, `LayerSpecification`, `MapMouseEvent`, etc.) may have changed or moved.

#### Known locations needing attention:

- [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx): [Lines 2, 21](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L2), [Lines 21](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L21)
- [`ConnectedMap.tsx`](../../src/components/ConnectedMap/ConnectedMap.tsx): [Lines 2, 13, 16](../../src/components/ConnectedMap/ConnectedMap.tsx#L2), [Lines 13, 16](../../src/components/ConnectedMap/ConnectedMap.tsx#L13-L16)
- [`useMapPositionSync.ts`](../../src/components/ConnectedMap/useMapPositionSync.ts): [Line 5](../../src/components/ConnectedMap/useMapPositionSync.ts#L5)
- [`GenericRenderer.ts`](../../src/core/logical_layers/renderers/GenericRenderer.ts): [Lines 17–27](../../src/core/logical_layers/renderers/GenericRenderer.ts#L17-L27)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx): [Lines 1, 16, 40, 43](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L1), [Lines 16, 40, 43](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L16-L43)
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx): [Lines 1, 17, 20](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L1), [Lines 17, 20](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L17-L20)
- [`helpers/activeAndHoverFeatureStates.ts`](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts): [Line 25](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts#L25)
- [`helpers/featureVisibilityCheck.ts`](../../src/core/logical_layers/renderers/helpers/featureVisibilityCheck.ts): [Line 3](../../src/core/logical_layers/renderers/helpers/featureVisibilityCheck.ts#L3)
- [`types/registry.ts`](../../src/core/logical_layers/types/registry.ts): [Line 13](../../src/core/logical_layers/types/registry.ts#L13)
- [`types/source.ts`](../../src/core/logical_layers/types/source.ts): [Line 5](../../src/core/logical_layers/types/source.ts#L5)
- [`types/`](../../src/core/logical_layers/types/): all custom types referencing MapLibre types
- [`features/`](../../src/features/): various usages in bivariate, boundary_selector, etc.
- [`utils/`](../../src/utils/): various usages in bivariate, map, etc.

### 2.2. Map Instantiation and Options

- `new maplibre.Map({...})` usage in [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx) must be checked for new/changed options (e.g., projection, WebGL2).
- Custom layer and source handling (e.g., `addSource`, `addLayer`) may require slot or ordering updates.

#### Known locations needing attention:

- [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx): [Lines 74–200](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L74-L200) (map instantiation, options, addSource/addLayer)
- [`GenericRenderer.ts`](../../src/core/logical_layers/renderers/GenericRenderer.ts): [Lines 65–200](../../src/core/logical_layers/renderers/GenericRenderer.ts#L65-L200) (addSource/addLayer)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx): [Lines 140–400](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L140-L400) (addSource/addLayer)
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx): [Lines 61–200](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L61-L200) (addSource/addLayer)
- [`layersOrder/layerByOrder.ts`](../../src/core/logical_layers/utils/layersOrder/layerByOrder.ts): [Lines 7–37](../../src/core/logical_layers/utils/layersOrder/layerByOrder.ts#L7-L37) (custom addLayer logic)

### 2.3. Event Handling

- `.on()` now returns a subscription object. All event handler registration and cleanup logic (e.g., `map.on('load', ...)`, `map.off(...)`) must be reviewed.

#### Known event registration/cleanup locations needing attention:

- [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx):
  - [Lines 74–87](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L74-L87): `map.on('load', ...)`, `map.off('load', ...)`
  - [Lines 88–200](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L88-L200): `map.on('idle', ...)`
- [`ConnectedMap.tsx`](../../src/components/ConnectedMap/ConnectedMap.tsx):
  - [Lines 61–81](../../src/components/ConnectedMap/ConnectedMap.tsx#L61-L81): `mapRef.current.on('click', ...)`, `mapRef.current.on('mousemove', ...)`, `mapRef.current.off(...)`
- [`useMapPositionSync.ts`](../../src/components/ConnectedMap/useMapPositionSync.ts):
  - [Lines 13–34](../../src/components/ConnectedMap/useMapPositionSync.ts#L13-L34): `map.on('moveend', ...)`, `map.off('moveend', ...)`
- [`GenericRenderer.ts`](../../src/core/logical_layers/renderers/GenericRenderer.ts):
  - [Lines 201–400](../../src/core/logical_layers/renderers/GenericRenderer.ts#L201-L400): event listener registration via `registerMapListener` (which may wrap `.on()`/`.off()`)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx):
  - [Lines 103–400](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L103-L400): event listener registration via `registerMapListener`
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx):
  - [Lines 61–200](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L61-L200): event listener registration via `registerMapListener`
- [`activeAndHoverFeatureStates.ts`](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts):
  - [Lines 25–112](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts#L25-L112): uses `map.on`/`map.setFeatureState` in handler logic

### 2.4. Feature State and Filtering

- `geometry-type` filter changes may affect logic in renderers and feature state handlers (see [`activeAndHoverFeatureStates.ts`](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts)).

#### Known locations needing attention:

- [`helpers/activeAndHoverFeatureStates.ts`](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts): [Lines 1–112](../../src/core/logical_layers/renderers/helpers/activeAndHoverFeatureStates.ts#L1-L112) (feature filtering, state logic)
- [`helpers/featureVisibilityCheck.ts`](../../src/core/logical_layers/renderers/helpers/featureVisibilityCheck.ts): [Lines 1–21](../../src/core/logical_layers/renderers/helpers/featureVisibilityCheck.ts#L1-L21) (feature visibility logic)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx): [Lines 103–400](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L103-L400) (feature state logic)
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx): [Lines 61–200](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L61-L200) (feature state logic)

### 2.5. Terrain and Elevation

- If using `queryTerrainElevation`, update logic to expect meters above sea level.
- For custom 3D objects, use the new `getElevationOffset` method.

#### Known locations needing attention:

- No direct usage of `queryTerrainElevation` or `getElevationOffset` found in the current codebase. If added in the future, review all usages accordingly.

### 2.6. Layer Ordering and Slots

- Custom layer ordering logic (see [`layersOrder/`](../../src/core/logical_layers/utils/layersOrder/)) may need to support new slot-based API.

#### Known locations needing attention:

- [`layersOrder/layerByOrder.ts`](../../src/core/logical_layers/utils/layersOrder/layerByOrder.ts): [Lines 1–45](../../src/core/logical_layers/utils/layersOrder/layerByOrder.ts#L1-L45) (layer ordering helpers)
- [`layersOrder/layersOrder.ts`](../../src/core/logical_layers/utils/layersOrder/layersOrder.ts): [Lines 1–231](../../src/core/logical_layers/utils/layersOrder/layersOrder.ts#L1-L231) (layer ordering manager)
- [`GenericRenderer.ts`](../../src/core/logical_layers/renderers/GenericRenderer.ts): [Lines 65–200](../../src/core/logical_layers/renderers/GenericRenderer.ts#L65-L200) (calls to layerByOrder)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx): [Lines 140–400](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx#L140-L400) (calls to layerByOrder)
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx): [Lines 61–200](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx#L61-L200) (calls to layerByOrder)

### 2.7. WebGL2 and Graphics Backend

- Ensure the environment supports WebGL2. If any custom WebGL1 code exists, plan for migration or removal.

#### Known locations needing attention:

- [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx): [Lines 74–200](../../src/components/ConnectedMap/map-libre-adapter/index.tsx#L74-L200) (map instantiation, options)
- No custom WebGL1 code detected in the codebase. If any direct WebGL context management is added, review for compatibility.

---

## 3. Migration Steps

### 3.1. Upgrade Dependency

- Update `maplibre-gl` in `package.json` to the latest v5.x:
  ```json
  "maplibre-gl": "^5.0.0"
  ```
- Run:
  ```sh
  pnpm install
  ```

### 3.2. Update Imports and Types

- Review all imports from `maplibre-gl` for renamed, removed, or changed types and APIs.
- Update type-only imports as needed.

### 3.3. Refactor Event Handling

- Update all `.on()`/`.off()` usages to handle the new subscription object if required.
- Ensure event cleanup logic is compatible with the new API.
- See the list above for all known locations requiring review.

### 3.4. Review Layer and Source Management

- Update any custom layer ordering logic to support slot-based API if using MapLibre Standard style.
- Review all usages of `addLayer`, `addSource`, and related methods for API changes.

### 3.5. Terrain and Elevation

- Update any usage of `queryTerrainElevation` to expect meters above sea level.
- Use `getElevationOffset` for custom 3D object positioning if needed.

### 3.6. Test Globe/Projection Features

- If using globe or custom projections, review new APIs and update initialization/configuration as needed.

### 3.7. Font and Style Changes

- If relying on default fonts, verify appearance and update style definitions if needed.

---

## 4. References

- [MapLibre GL JS v5 Breaking Changes Issue](https://github.com/maplibre/maplibre-gl-js/issues/3834)
- [MapLibre GL JS Changelog](https://github.com/maplibre/maplibre-gl-js/blob/main/CHANGELOG.md)
- [Style Spec geometry-type PR](https://github.com/maplibre/maplibre-style-spec/pull/519)
- [WebGL2 Discussion](https://github.com/maplibre/maplibre-gl-js/issues/3947)
- [Default Font PR](https://github.com/maplibre/maplibre-style-spec/pull/436)

---

## 5. Code Locations to Review

- [`map-libre-adapter/index.tsx`](../../src/components/ConnectedMap/map-libre-adapter/index.tsx) (map instantiation, event handling)
- [`ConnectedMap.tsx`](../../src/components/ConnectedMap/ConnectedMap.tsx) (event registration, marker usage)
- [`GenericRenderer.ts`](../../src/core/logical_layers/renderers/GenericRenderer.ts) (renderer logic)
- [`BivariateRenderer/BivariateRenderer.tsx`](../../src/core/logical_layers/renderers/BivariateRenderer/BivariateRenderer.tsx) (renderer logic)
- [`ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx`](../../src/core/logical_layers/renderers/ClickableFeaturesRenderer/ClickableFeaturesRenderer.tsx) (renderer logic)
- [`layersOrder/`](../../src/core/logical_layers/utils/layersOrder/) (layer ordering logic)
- [`types/`](../../src/core/logical_layers/types/) (custom types, registry)
- [`features/`](../../src/features/) and [`utils/`](../../src/utils/) for any direct MapLibre usage

---

**This report should be reviewed and updated as new breaking changes or migration notes are published by the MapLibre project.**
