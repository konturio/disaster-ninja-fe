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
    mountLayer: (layer: IMapLogicalLayer) => layer,
    unmountLayer: (layer: IMapLogicalLayer | string) => layer,
  },
  ({ get, onAction, onChange }, state: IMapLogicalLayer[] = []) => {
    const map = get('currentMapAtom');

    onAction('mountLayer', (layer: IMapLogicalLayer) => {
      if (!map) return;

      if (state.findIndex((lr) => lr.id === layer.id) !== -1) {
        throw new Error('Layer with such ID is already added to map');
        return;
      }
      layer.mount(map);
    });

    onAction('unmountLayer', (layer: IMapLogicalLayer | string) => {
      if (!map) return;

      const layerId = typeof layer !== 'string' ? layer.id : layer;
      const addedLayer = state.find((lr) => lr.id === layerId);
      if (!addedLayer) {
        throw new Error('Layer with such ID is not added to map');
        return;
      }
      if (addedLayer.unmount) {
        addedLayer.unmount(map);
      }
    });

    // reset all map layers when map object has been changed
    onChange('currentMapAtom', (mapState) => {
      state = [];
    });

    return state;
  },
);
