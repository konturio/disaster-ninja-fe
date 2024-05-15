import { createAtom } from '~utils/atoms';
import type { DrawModeType } from '../constants';

export const activeDrawModeAtom = createAtom(
  {
    setDrawMode: (mode: DrawModeType | null) => mode,
  },
  ({ onAction }, state: DrawModeType | null = null) => {
    onAction('setDrawMode', (mode) => {
      if (state !== mode) {
        state = mode;
      }
    });

    return state;
  },
  'activeDrawModeAtom',
);
