import type { LayerFieldModel } from '~features/create_layer/types';
import { createAtom } from '~utils/atoms';
import { FieldTypes } from '../constants';
import type { EditableLayerFieldType } from '../types';

export type LayerEditorFormFieldAtomType = ReturnType<
  typeof createLayerEditorFormFieldAtom
>;
let i = 0;
export function createLayerEditorFormFieldAtom(initialState?: LayerFieldModel) {
  return createAtom(
    {
      updateName: (name: string) => name,
      updateType: (type: EditableLayerFieldType) => type,
    },
    (
      { onAction },
      state: LayerFieldModel = initialState || {
        name: '',
        type: FieldTypes.None,
      },
    ) => {
      onAction('updateName', (name) => {
        if (state.name !== name) {
          state = { ...state, name };
        }
      });

      onAction('updateType', (type) => {
        if (state.type !== type) {
          state = { ...state, type };
        }
      });

      return state;
    },
    `layerEditorFormFieldAtom_${i++}`,
  );
}
