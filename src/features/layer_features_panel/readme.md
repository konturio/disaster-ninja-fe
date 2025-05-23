## Layer Features Panel

This feature enables Layer Features panel. The panel displays a list of features of the associated layer. Features are filtered by the the Selected area geometry.

- If Selected area is not empty, the features data is requested from the backend and then displayed as a list of items
- If Selected area is empty, the features list is empty
- By default, the panel displays items even if the associated layer (e.g. `hotProjects_outlines`) is disabled.
  - This behavior can be changed to require the layer to be enabled (see [How to use](#how-to-use))

### Feature Flag

`AppFeature.LAYER_FEATURES_PANEL`

### How to use

1. Add `AppFeature.LAYER_FEATURES_PANEL` feature to the app configuration:

```ts
{
  ...
  "features": [
    ...
    {
      "name": "layer_features_panel",
      "description": "Layer Feature panel",
      "type": "UI_PANEL",
      "configuration": {
        "layerId": "hotProjects_outlines",
        "requiresEnabledLayer": true
      }
    }
  ]
}
```

- The feature configuration needs to implement `LayerFeaturesPanelConfig` interface:
  - `layerId` - the id of the associated layer
  - `requiresEnabledLayer`
    - `true` the associated layer must be enabled
    - `false` Layer Features panel works regardless of its associated layer's status.

2. Define a UniLayout JSON description for the layer inside `src/features/layer_features_panel/layouts`.
3. Add the layout to `layerLayouts` map.

### How it works

1. `fetchLayerFeaturesResource` is fetching the data from the layer features endpoint (`/layers/${layerId}/items/search`).

- New data is fetched each time the Selected area changes.
- The data is only fetched if both are true:
  - The Selected area is not empty.
  - The associated layer is enabled (if the layer is required to be enabled).

2. [layerFeaturesCollectionAtom](./atoms/layerFeaturesCollectionAtom.ts) exposes fetched features
3. [LayerFeaturesPanel](./components/LayerFeaturesPanel/index.tsx) renders features using the UniLayout template.
