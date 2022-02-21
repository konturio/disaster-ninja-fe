import { Atom } from '@reatom/core';
import { CreateLayerModel } from '~features/create_layer/types';
import { createAtom } from '~utils/atoms';
import { createLayerFieldAtom } from '~features/create_layer/atoms/createLayerField';

const DEFAULT_ATOM_STATE: CreateLayerModel = {
  id: -1,
  name: '',
  marker: 'default',
  fields: []
}

export function createLayerDataAtom(initialState?: CreateLayerModel): Atom<CreateLayerModel> {
  return createAtom(
    {
      updateName: (name: string) => name,
      updateMarker: (marker: string) => marker,
      addField: () => null,
      removeField: (fieldIndex: number) => fieldIndex,
    },
    ({ onAction }, state: CreateLayerModel = initialState || DEFAULT_ATOM_STATE) => {
      onAction('updateName', (name) => {
        if (state.name !== name) {
          state = { ... state, name };
        }
      });

      onAction('addField', () => {
        state.fields.push(createLayerFieldAtom());
        state = { ...state };
      });

      onAction('removeField', (fieldIndex) => {
        state.fields.splice(fieldIndex);
        state = { ...state };
      });

      return state;
    },
    'createLayerDataAtom'
  );
}
