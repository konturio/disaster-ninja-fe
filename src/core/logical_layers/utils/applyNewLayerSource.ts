import { store } from '~core/store/store';
import { layersRegistryAtom } from '../atoms/layersRegistry';
import { createUpdateLayerActions } from './createUpdateActions';
import type { LayerSource } from '../types/source';

export function applyNewLayerSource(newSource: LayerSource) {
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
  } else {
    console.error(
      `Cannot apply new source for ${id}. The layer with the given id not found`,
    );
  }
}
