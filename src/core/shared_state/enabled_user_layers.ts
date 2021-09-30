import { createAtom } from '@reatom/core';

export interface EnabledLayer {
  id: string;
}

export const enabledLayersAtom = createAtom(
  {
    enableLayer: (layer: EnabledLayer) => layer,
    disableLayer: (layerId: string) => layerId,
  },
  ({ onAction }, state: EnabledLayer[] = []) => {
    onAction('enableLayer', (layer) => state.push(layer));
    onAction(
      'disableLayer',
      (layerId) => (state = state.filter((layer) => layer.id !== layerId)),
    );
    return state;
  },
);
