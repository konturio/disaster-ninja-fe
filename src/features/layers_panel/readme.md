## Layers Panel

This feature adds layers panel UI with layers tree, generated from layers that was added to layers registry.
Currently it's used as part of combined LayersAndLegends panel, rendered inside [FullAndShortStatesPanelWidget](/src/widgets/FullAndShortStatesPanelWidget/index.tsx) container in fullState.

### Feature Flag

AppFeature.MAP_LAYERS_PANEL

### How to use

This feature implements [PanelFeatureInterface](/src/types/featuresTypes.ts) and provides content for panel (JSX.Element) that can be rendered inside compatible container

```ts
<FullAndShortStatesPanelWidget
  fullState={featureFlags[AppFeature.MAP_LAYERS_PANEL] ? layersPanel() : null}
/>
```

### How it works

[LayersTree](/src/features/layers_panel/components/LayersTree/LayersTree.tsx) component renders layers tree hierarchy based on state stored in [layersTreeAtom](/src/core/logical_layers/atoms/layersTree/layersTree.ts).

Tree data structure generated in [createTree](/src/core/logical_layers/atoms/layersTree/createTree.ts).
Tree can contain `Category`, `Group` and `Layer` items.

Additional settings for Categories will be merged from `layersCategoriesSettingsAtom` and for Groups from `layersGroupsSettingsAtom`

### UX details

- "Deselect" buttons for mutually exclusive groups and categories become disabled when none of their layers are active. This prevents confusing interactions when there is nothing to deselect.
