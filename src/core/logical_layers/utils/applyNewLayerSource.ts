import { store } from '~core/store/store';
import { enabledLayersAtom } from '../atoms/enabledLayers';
import { createUpdateLayerActions } from './createUpdateActions';
import type { LayerSource } from '../types/source';
import type { Action } from '@reatom/core-v2';

export function applyNewLayerSource(newSource: LayerSource) {
  const id = newSource.id;
  const actions: Array<Action> = [
    enabledLayersAtom.delete(id),
    ...createUpdateLayerActions([
      {
        id,
        source: newSource,
      },
    ]).flat(),
  ];
  store.dispatch(actions);
  store.dispatch(enabledLayersAtom.set(id));
}
