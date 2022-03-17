import { CreateLayerModel } from '~features/create_layer/types';
import { createAtom } from '~utils/atoms';
import { createLayerFieldAtom } from '~features/create_layer/atoms/createLayerField';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_ATOM_STATE: CreateLayerModel = {
  id: -1,
  name: '',
  marker: 'default',
  fields: [],
};

export type LayerDataAtomType = ReturnType<typeof createLayerDataAtom>;

export function createLayerDataAtom(initialState?: CreateLayerModel) {
  return createAtom(
    {
      updateName: (name: string) => name,
      updateMarker: (marker: string) => marker,
      addField: () => null,
      removeField: (fieldIndex: number) => fieldIndex,
      reorderFields: (oldIndex: number, newIndex: number) => ({
        oldIndex,
        newIndex,
      }),
    },
    (
      { onAction },
      state: CreateLayerModel = initialState || DEFAULT_ATOM_STATE,
    ) => {
      onAction('updateName', (name) => {
        if (state.name !== name) {
          state = { ...state, name };
        }
      });

      onAction('addField', () => {
        state.fields.push(createLayerFieldAtom());
        state = { ...state };
      });

      onAction('removeField', (fieldIndex) => {
        state.fields.splice(fieldIndex, 1);
        state = { ...state };
      });

      onAction('reorderFields', ({ oldIndex, newIndex }) => {
        const tmp = state.fields[oldIndex];
        state.fields[oldIndex] = state.fields[newIndex];
        state.fields[newIndex] = tmp;
        state = { ...state };
      });

      return state;
    },
    `createLayerDataAtom_${uuidv4()}`,
  );
}
