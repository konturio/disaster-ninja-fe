import { createAtom } from '@reatom/core';

export const enabledLayersAtom = createAtom(
  {
    enableLayer: (layer: string) => layer,
    disableLayer: (layerId: string) => layerId,
    setLayers: (layersIds: string[]) => layersIds,
    disableAllLayers: () => null,
  },
  ({ onAction }, state: string[] = []) => {
    onAction('enableLayer', (layer) => (state = [...state, layer]));
    onAction(
      'disableLayer',
      (layerId) => (state = state.filter((layer) => layer !== layerId)),
    );
    onAction(
      'setLayers',
      (layersIds) => (
        console.log('[LayersAtom] onAction "setLayers":', layersIds),
        (state = [...layersIds])
      ),
    );

    console.log('[LayersAtom] Current state:', state);
    return state;
  },
);
