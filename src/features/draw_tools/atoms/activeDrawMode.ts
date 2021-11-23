import { createBindAtom } from '~utils/atoms/createBindAtom';
import { DrawModeType } from '../constants';

export const activeDrawModeAtom = createBindAtom(
  {
    setDrawMode: (mode: DrawModeType | undefined) => mode,
  },
  ({ onAction }, state: DrawModeType | undefined = undefined) => {
    onAction('setDrawMode', (mode) => {
      if (state !== mode) {
        state = mode;
      }
    });

    return state;
  },
  'activeDrawModeAtom',
);
