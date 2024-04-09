import { store } from '~core/store/store';
import { layersRegistryAtom } from '../atoms/layersRegistry';
import { createUpdateLayerActions } from './createUpdateActions';
import type { LayerSource } from '../types/source';

export function applyNewSourceToExistingLayer(newSource: LayerSource) {
  const id = newSource.id;
  const layerAtom = store.getState(layersRegistryAtom).get(id);
  if (layerAtom) {
    store.dispatch([
      layerAtom.disable(),
      ...createUpdateLayerActions([
        {
          id,
          source: newSource,
        },
      ]).flat(),
    ]);
    store.dispatch([layerAtom.enable()]);
  }
}
