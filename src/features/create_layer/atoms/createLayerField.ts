import { LayerFieldModel } from '~features/create_layer/types';
import { createAtom } from '~utils/atoms';
import { v4 as uuidv4 } from 'uuid';
import { UserDataFieldNoneType, UserDataFieldType } from '~core/logical_layers/types/userData';

export type LayerFieldAtomType = ReturnType<typeof createLayerFieldAtom>;

export function createLayerFieldAtom(initialState?: LayerFieldModel) {
  return createAtom(
    {
      updateName: (name: string) => name,
      updateType: (type: UserDataFieldType) => type,
    },
    ({ onAction }, state: LayerFieldModel = initialState || { name: '', type: UserDataFieldNoneType }) => {
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
    `LayerFieldAtom_${uuidv4()}`,
  );
}
