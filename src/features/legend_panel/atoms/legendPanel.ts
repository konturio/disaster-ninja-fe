import { createBindAtom } from '~utils/atoms';
import { LayerLegend } from '~utils/atoms/createLogicalLayerAtom';

export const legendPanelAtom = createBindAtom(
  {
    addLegend: (legend: LayerLegend) => legend,
    removeLegend: (legendName: string) => legendName,
  },
  ({ onAction }, state: LayerLegend[] = []) => {
    onAction('addLegend', (legend) => {
      if (state.findIndex((lg) => lg.name === legend.name) === -1) {
        state = [...state, legend];
      }
    });
    onAction('removeLegend', (legendName) => {
      state = state.filter((lg) => lg.name !== legendName);
    });
    return state;
  },
);
