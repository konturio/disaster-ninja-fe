import { createAtom } from '~utils/atoms';
import { createLayerDataAtom, LayerDataAtomType } from '~features/create_layer/atoms/createLayerData';

type CreateLayerAtomStateType = {
  loading: boolean;
  error: string | null;
  data: LayerDataAtomType | null;
}

export const activeCreateLayerAtom = createAtom(
  {
    editLayer: (id: number) => id,
    createNewLayer: () => null,
    reset: () => null,
  },
  ({ onAction }, state: CreateLayerAtomStateType | null = null) => {
    onAction('editLayer', (id) => {
      state = {
        loading: false,
        error: null,
        data: createLayerDataAtom({ id: 1, name: 'test', marker: 'default', fields: [] }),
      }
    });

    onAction('createNewLayer', () => {
      state = {
        loading: false,
        error: null,
        data: createLayerDataAtom(),
      }
    });

    onAction('reset', () => {
      if (state) {
        state = null;
      }
    });

    return state;
  },
  'currentCreateLayerAtom',
);
