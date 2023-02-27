## Layers Panel

This feature adds layers panel UI with layers tree.
Currently it's used as part of combined LayersAndLegends panel, rendered inside [FullAndShortStatesPanelWidget](/src/widgets/FullAndShortStatesPanelWidget/index.tsx) container in fullState.

### Feature Flag

FeatureFlag.MAP_LAYERS_PANEL

### How to use

This feature implements [PanelFeatureInterface](/src/types/featuresTypes.ts) and provides content for panel (JSX.Element) that can be rendered inside compatible container

```ts
<FullAndShortStatesPanelWidget
  fullState={featureFlags[FeatureFlag.MAP_LAYERS_PANEL] ? layersPanel() : null}
/>
```

### How it works

[LayersTree](/src/features/layers_panel/components/LayersTree/LayersTree.tsx) component renders layers tree hierarchy based on state stored in [layersTreeAtom](/src/core/logical_layers/atoms/layersTree/layersTree.ts).

Tree data structure generated in [createTree](/src/core/logical_layers/atoms/layersTree/createTree.ts).
Tree can contain `Category`, `Group` and `Layer` items.

Additional settings for Categories will be merged from `layersCategoriesSettingsAtom` and for Groups from `layersGroupsSettingsAtom`
