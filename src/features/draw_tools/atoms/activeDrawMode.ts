import { createLogicalLayerAtom } from '~utils/atoms';
import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DrawModeType } from '../constants';

export const activeDrawModeAtom = createBindAtom(
  {
    setDrawMode: (mode: DrawModeType | undefined) => mode,
  },
  ({ onChange, onAction }, state: DrawModeType | undefined = undefined) => {
    onAction('setDrawMode', (mode) => {
      if (state !== mode) {
        state = mode;
      }
      // createLogicalLayerAtom()
    });

    return state;
  },
  'activeDrawModeAtom',
);
