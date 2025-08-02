## Layer Features Panel

This feature enables Layer Features panel. The panel displays a list of features of the associated layer. Features are filtered by the the Selected area geometry.

- If Selected area is not empty, the features data is requested from the backend and then displayed as a list of items
- If Selected area is empty, the features list is empty
- By default, the panel displays items even if the associated layer (e.g. `hotProjects_outlines`) is disabled.
  - This behavior can be changed to require the layer to be enabled (see [How to use](#how-to-use))
- In HOT Tasking Manager Projects, creation date, mapping types, last contribution and the Tasking Manager link are shown only for the selected card.

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
        "requiresEnabledLayer": true,
        "requiresGeometry": false,
        "maxItems": 1000,
        "sortOrder": "desc",
        "showBboxFilterToggle": true
      }
    }
  ]
}
```

- The feature configuration needs to implement `LayerFeaturesPanelConfig` interface:
  - `layerId` - the id of the associated layer
  - `requiresEnabledLayer`
    - `true` the associated layer must be enabled
    - `false` Layer Features panel works regardless of its associated layer's status
  - `requiresGeometry`
    - `true` Layer Features are loaded only if geometry (Selected Area or Bbox filter) is not empty
    - `false` Layer Features are loaded regardless of Selected Area or Bbox filter
  - `maxItems` - limits number of items that can be shown in the panel
  - `sortOrder` - `asc`/`desc` order in which items are sorted
  - `showBboxFilterToggle` - if true, a "Filter by window view" toggle button is displayed at the top of the panel

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

### Bbox filter

If `showBboxFilterToggle` is enabled, the Bbox filter toggle button (`BBoxFilterToggle` component) is displayed.
When Bbox filter button is turned on, current bounding box coordinates are used to filter the layer features (instead of Selected Area layer). The geometry can be updated manually using "update" button near the toggle.

### How it works

1. `fetchLayerFeaturesResource` is fetching the data from the layer features endpoint (`/layers/${layerId}/items/search`).

- New data is fetched each time the Selected area (or Bbox filter, if enabled) changes.
- The data is only fetched if both are true:
  - The Selected area/Bbox filter is not empty (if `requiresGeometry === true`).
  - The associated layer is enabled (if `requiresEnabledLayer === true`).

2. [layerFeaturesCollectionAtom](./atoms/layerFeaturesCollectionAtom.ts) transforms the data from `fetchLayerFeaturesResource` into an array of items (`FeatureCardCfg[]`)
3. [LayerFeaturesPanel](./components/LayerFeaturesPanel/index.tsx) component renders a list of items based on data from `layerFeaturesCollectionAtom`.
