## Full and short state panel widget

This widget allows to merge 2 panels into single panel with full and short state.
Since each panels content represented as a feature, widget has a logic when one or both panels aren't available.
It expects panels contents to follow [PanelFeatureInterface](https://github.com/konturio/disaster-ninja-fe/blob/main/src/types/featuresTypes.ts)

### Panel State Persistence

When `id` prop is provided, the widget stores current panel state (`full`, `short`, or `closed`) in `localStorage` using the key `panel-state-<id>`. The saved state is loaded on the next application start.
