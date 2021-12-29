import { createBindAtom } from '~utils/atoms/createBindAtom';
import { drawModes, DrawModeType } from '../constants';

export const activeDrawModeAtom = createBindAtom(
  {
    setDrawMode: (mode: DrawModeType | null) => mode,
    toggleDrawMode: (mode: DrawModeType | null) => mode,
  },
  ({ onAction }, state: DrawModeType | null = null) => {
    onAction('setDrawMode', (mode) => {
      if (state !== mode) {
        state = mode;
      }
    });

    onAction('toggleDrawMode', (mode) => {
      if (!mode && !state) return;
      if (mode === drawModes.ModifyMode && state === mode) return;
      if (state === mode) {
        state = drawModes.ModifyMode;
      } else state = mode;
    });

    return state;
  },
  'activeDrawModeAtom',
);
