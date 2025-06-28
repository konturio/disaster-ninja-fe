## Legend panel

This feature shows list of layers legends, their info and hiding control

### How to use

This feature used to be a full scale panel (`<Panel />`), but then was reduced to the content of the panel. It's content now combined with `layers_panel` content and used in the app via `FullAndShortStatesPanelWidget`

```ts
import { legendPanel } from '~features/legend_panel';
import { FullAndShortStatesPanelWidget } from '~widgets/FullAndShortStatesPanelWidget';

<FullAndShortStatesPanelWidget
  fullState={legendPanel()}
  key="legend_panel"
  id="legend_panel"
/>

<App>
  <FullAndShortStatesPanelWidget />
</App>
```

### How it works

`<PanelContent />` renders the list of layers based on `mountedLayersAtom`.
Legends can either be bivariate [BivariateLegend](github.com/konturio/disaster-ninja-fe/blob/main/src/components/BivariateLegend/BivariateLegend.tsx) or "simple" [SimpleLegend](https://github.com/konturio/disaster-ninja-fe/blob/main/src/components/SimpleLegend/SimpleLegend.tsx).
Simple legends respect a `fill-opacity` style property which controls the opacity of the icon fill. This is used for event shape layers like Alert Area or volcano forecasts.
