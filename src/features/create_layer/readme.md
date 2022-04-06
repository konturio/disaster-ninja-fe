# Create Layer Feature

Feature flag name: `create_layer`

## Short feature purpose description:

Allows the authorized user to create and edit his own layers.

## How it works

Consists of two parts:

1. Create / Edit Layer properties
2. Create / Edit layer features

```mermaid
flowchart TD
  classDef coreAtom stroke:orange;
  classDef View stroke:green;

  enabledLayersAtom:::coreAtom --> editableLayersDetailsResource
  editableLayersListResource --> editableLayersDetailsResource
  editableLayersDetailsResource --> editableLayersLegendsAndSources
  currentApplicationAtom:::coreAtom --> editableLayersListResource
  editableLayersLegendsAndSources --> layersLegendsAtom:::coreAtom
  editableLayersLegendsAndSources --> layersSourcesAtom:::coreAtom
  editableLayersListResource --> editableLayersControlsAtom
  editableLayersControlsAtom --> layersRegistryAtom:::coreAtom
  editableLayersControlsAtom --> layersMetaAtom:::coreAtom
  editableLayersControlsAtom --> layersSettingsAtom:::coreAtom
  editableLayersControlsAtom --> layersMenusAtom:::coreAtom
  editableLayersListResource --> layerSideBarButtonController
  layerSideBarButtonController --> sideControlsBarAtom:::coreAtom
  layerSideBarButtonController --> editableLayerControllerAtom
  editableLayersControlsAtom ----> editableLayerControllerAtom
  %% Sub features switch
  editTargetAtom --> EditFeaturesOrLayerPanel:::View
  EditFeaturesOrLayerPanel --> EditLayerPanel:::View
  EditFeaturesOrLayerPanel --> EditFeaturesPanel:::View
  %% Edit Layer
  EditLayerPanel --> editableLayerControllerAtom
  editableLayerControllerAtom --> EditLayerPanel
  EditLayerPanel --> EditLayerForm:::View
  EditLayerForm  --> EditableLayerFieldsPlaceholder:::View
  EditableLayerFieldsPlaceholder --> EditableLayerFieldContainer:::View
  editableLayerControllerAtom --> layerEditorFormAtom
  editableLayerControllerAtom --> layerEditorFormFieldAtom
  editableLayerControllerAtom --> editableLayersListResource
  editableLayerControllerAtom --> editTargetAtom
  %% Edit Features
  editableLayersControlsAtom --> featurePanelControllerAtom
  EditFeaturesPanel:::View ---> featurePanelControllerAtom
  featurePanelControllerAtom --> editTargetAtom
  EditFeaturesPanel --> AddOrEditFeatureForm:::View
  drawToolsListenerAtom --> featurePanelControllerAtom
  drawnGeometryAtom:::coreAtom --> drawToolsListenerAtom
  drawToolsListenerAtom --> drawnFeaturesAtom
```

### Stage I - adding controls

1. When feature activated it run `layerSideBarButtonControllerAtom` and `layerContextMenu`.
2. `layerSideBarButtonControllerAtom` optionally add "create layer" control in side bar
3. `editableLayersControls` - add layers to "layers_panel" with "edit layer" and "edit features" options in layer context menu
4. `editableLayersControls` - add layers to "layers_panel" with "edit layer" and "edit features" options in layer context menu

5. It fetch user layers, and if such layers exist - add it in logical layers registry, with attached "edit" option.
   In case this feature disabled - `layers_in_area` fetch this layers with other regular layers without adding "edit" option.
   (`layers_in_area` checking `create_layer` flag for that)

### Stage II - Creating layer
