## Focused geometry editor

This feature provides editing interface of the draw tools for the core entity of this app - `focused geometry`.

### How to use

It's a simple component hooked on the `toolbarControlsAtom` core entity. All you have to do is to run `initFocusedGeometry` in the app once.

### How it works

First of all it makes sure `focusedGeometryEditorAtom` have been started (here it's done with `forceRun` utility).
Then it describes it's element control for `toolbarControlsAtom` and the actions needed on enabling and disabling this feature.

```ts
import('~features/focused_geometry_editor/').then(({ initFocusedGeometry }) =>
  initFocusedGeometry(),
);
```

#### On enabling

`isEditorActiveAtom` sets to `true`, this triggers `focusedGeometryEditorAtom`. It hides focused geometry layer, if any geometry existed. It also starts listening to any uploaded files, so that if user uploads geometry - he would be able to edit it right away.
`toolboxAtom` being enabled for all editor modes and also gets a callback action for disabling actions.
While `toolboxAtom` is responsible for UI component of the draw tools, several actions enabling them on the map - `drawModeLogicalLayerAtom.enable` is self-explanatory, `activeDrawModeAtom.setDrawMode` sets initial draw mode to preferred one and `setIndexesForCurrentGeometryAtom.set(true)` provides autoselect of the focused geometry shapes (so that user can modify them instantly). The map view is also adjusted to fit the current focused geometry when editing starts, so the whole area is visible on screen.

#### On disabling

`isEditorActiveAtom` sets to `false` so `focusedGeometryEditorAtom` stops the rest of its subscriptions.
A `finishButtonCallback` for `toolboxAtom` will be called, saving edited geometry to the core `focusedGeometryAtom` and enabling its layer back. It will also deal with the toolbox itself.
Logical layer for the editing will be disabled via `drawModeLogicalLayerAtom.disable` and the draw mode will be reset via `activeDrawModeAtom.setDrawMode(null)`
