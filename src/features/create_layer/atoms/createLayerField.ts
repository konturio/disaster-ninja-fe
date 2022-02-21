import { Atom } from '@reatom/core';
import { LayerFieldModel, LayerFieldType } from '~features/create_layer/types';
import { createAtom } from '~utils/atoms';

export function createLayerFieldAtom(): Atom<LayerFieldModel> {
  return createAtom(
    {
      updateName: (name: string) => name,
      updateType: (type: LayerFieldType) => type,
    },
    ({ onAction }, state: LayerFieldModel = { name: '', type: 'none' }) => {
      onAction('updateName', (name) => {
        if (state.name !== name) {
          state = { ...state, name }
        }
      });

      onAction('updateType', (type) => {
        if (state.type !== type) {
          state = { ...state, type }
        }
      });

      return state;
    },
    'LayerFieldAtom');
}
