import { createAtom } from '@reatom/core';
import { currentMapAtom } from '~core/shared_state/currentMap';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

export interface IMapLogicalLayer {
  id: string;
  name?: string;
  visibleInPanel?: boolean;
  mount: (map: ApplicationMap) => void;
  unmount?: (map: ApplicationMap) => void;
}

export const mapLogicalLayersAtom = createAtom(
  {
    currentMapAtom,
    addLayer: (layer: IMapLogicalLayer) => layer,
    removeLayer: (layer:  IMapLogicalLayer | string) => typeof layer === 'string' ? layer : layer.id,
    mountLayer: (layerId: string) => layerId,
    unmountLayer: (layerId: string) => layerId,
  },
  ({ get, onAction, onChange }, state: IMapLogicalLayer[] = []) => {
    const map = get('currentMapAtom');

    onAction('addLayer', (layer: IMapLogicalLayer) => {
      state = [...state, layer];
    });

    onAction('removeLayer', (layerId: string) => {
      state = state.filter(lr => lr.id !== layerId);
    });


    onAction('mountLayer', (layerId: string) => {
      if (!map) return;
      const layer = state.find(layer => layer.id === layerId);
      if (!layer) {
        throw new Error(`Layer with '${layerId}' ID is not added to logical layers`);
      }
      layer.mount(map);
    });

    onAction('unmountLayer', (layerId: string) => {
      if (!map) return;

      const layer = state.find(layer => layer.id === layerId);
      if (!layer) {
        throw new Error(`Layer with '${layerId}' ID is not added to logical layers`);
      }

      if (layer.unmount) {
        layer.unmount(map);
      }
    });


        // reset all map layers when map object has been changed
    onChange('currentMapAtom', (mapState) => {
      state = [];
    });




    return state;
  },
);
