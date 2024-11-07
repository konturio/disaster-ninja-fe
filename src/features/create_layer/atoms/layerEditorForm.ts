import { createAtom } from '~utils/atoms';
import { createLayerEditorFormFieldAtom } from './layerEditorFormField';
import type { LayerEditorFormModel } from '../types';

const getDefaultAtomState = (): LayerEditorFormModel => ({
  name: '',
  marker: 'default',
  fields: [],
});

export type LayerEditorFormAtomType = ReturnType<typeof createLayerEditorFormAtom>;

let counter = 0;
export function createLayerEditorFormAtom(initialState?: LayerEditorFormModel) {
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
      state: LayerEditorFormModel = initialState || getDefaultAtomState(),
    ) => {
      onAction('updateName', (name) => {
        if (state.name !== name) {
          state = { ...state, name };
        }
      });

      onAction('addField', () => {
        state.fields.push(createLayerEditorFormFieldAtom());
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
    `layerEditorFormAtom_${counter++}`,
  );
}
