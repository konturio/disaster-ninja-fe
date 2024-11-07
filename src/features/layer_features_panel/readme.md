## Layer Features Panel

This feature enables Layer Features panel. The panel displays a list of features of the associated layer. Features are filtered by the the Selected area geometry.

- If Selected area is not empty, the features data is requested from the backend and then displayed as a list of items
- If Selected area is empty, the features list is empty
- By default, the panel displays items even if the associated layer (e.g. `hotProjects_outlines`) is disabled.
  - This behavior can be changed to require the layer to be enabled (see [How to use](#how-to-use))

### Feature Flag

`FeatureFlag.LAYER_FEATURES_PANEL`

### How to use

1. Add `FeatureFlag.LAYER_FEATURES_PANEL` flag to the app configuration:

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
        "layerId": "hotProjects_outlines"
      }
    }
  ]
}
```

- The feature configuration needs to implement `LayerFeaturesPanelConfig` interface:
  - `layerId` - the id of the associated layer

2. Create a function to transform Feature properties to `FeatureCardCfg` interface.
3. Add a new case inside `transformFeaturesToPanelData` for the associated layer id, return the result of the function there:

```ts
function transformFeaturesToPanelData(featuresList: object): FeatureCardCfg[] {
  switch (featuresPanelLayerId) {
    case HOT_PROJECTS_LAYER_ID:
      return getHotProjectsPanelData(featuresList);
    case ACAPS_LAYER_ID:
    case ACAPS_SIMPLE_LAYER_ID:
      return getAcapsPanelData(featuresList);
    /* Add the case with new the layer here */
    default:
      console.error(`Layer Features panel: unsupported layerId: ${featuresPanelLayerId}`);
      return [];
  }
}
```

4. If you want the panel to only display items if the associated layer is enabled, add the layer id to `LAYERS_REQUIRED_BY_FEATURE_PANEL` array (_TODO: this should be moved a configuration field_):

```ts
export const LAYERS_REQUIRED_BY_FEATURE_PANEL = [HOT_PROJECTS_LAYER_ID];
```

### How it works

1. `fetchLayerFeaturesResource` is fetching the data from the layer features endpoint (`/layers/${layerId}/items/search`).

- New data is fetched each time the Selected area changes.
- The data is only fetched if both are true:
  - The Selected area is not empty.
  - The associated layer is enabled (if the layer is required to be enabled).

2. [layerFeaturesCollectionAtom](./atoms/layerFeaturesCollectionAtom.ts) transforms the data from `fetchLayerFeaturesResource` into an array of items (`FeatureCardCfg[]`)
3. [LayerFeaturesPanel](./components/LayerFeaturesPanel/index.tsx) component renders a list of items based on data from `layerFeaturesCollectionAtom`.
