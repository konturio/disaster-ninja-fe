## Map ruler

This feature adds layer on the map that enables interactive ruler with distance measurements

### How to use

This feature is hooked to the toolbar instance. Once toolbar is presented just run initiating function once

```ts
if (featureFlags[FeatureFlag.MAP_RULER]) {
  import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
}
```

### How it works

Root index file creates layers renderer instance and creates logical layer atom via `createLogicalLayerAtom` (it also adds layer to the layers registry).
Then toolbars control being described, and the control logic is simple - enable logical layer on activation, disable on deactivation

#### Map ruler renderer

This features renderer is a custom renderer ([read more about renderers](https://github.com/konturio/disaster-ninja-fe/blob/main/src/core/logical_layers/rfc.md#layers-renderers)).
On mount:

1. DeckGl config is used to create new map layer. The point of this is to describe what to draw, which way and how to handle user interaction events. You can read more about [Deck Gl geojson layer props](https://deck.gl/docs/api-reference/layers/geojson-layer), [Composite layer props](https://deck.gl/docs/api-reference/core/composite-layer) to understand configs described in `MapRulerRenderer`. You can also read about [NebulaGl geojson layer](https://nebula.gl/docs/api-reference/layers/editable-geojson-layer) we're alterating and see it's [source code](https://github.com/uber/nebula.gl/blob/master/modules/layers/src/layers/editable-geojson-layer.ts) to see what methods we're changing
2. Lines are rendered with `lineWidthUnits` set to `pixels` to keep them visible on mobile devices
3. Map layer being added on the map with a help of `layerByOrder` utility
4. Map click and move listeners added on top of other following map listeners preventing the latter
