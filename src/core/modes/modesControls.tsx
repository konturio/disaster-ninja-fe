import { createAtom } from '~utils/atoms';
import { currentModeAtom } from './currentMode';
import type { ApplicationMode } from './currentMode';

export interface ModeControl {
  id: ApplicationMode;
  icon: JSX.Element;
  active: boolean;
  onClick: () => void;
  onChange?: (isActive: boolean) => void;
}

type ModesControlsAtomState = Record<string, ModeControl>;
export const modesControlsAtom = createAtom(
  {
    addControl: (control: ModeControl) => control,
    removeControl: (controlId: ApplicationMode) => controlId,
    _enable: (controlId: ApplicationMode) => controlId,
    currentModeAtom,
  },
  (
    { onAction, onChange, schedule, create },
    state: ModesControlsAtomState = {},
  ) => {
    onAction('addControl', (control) => {
      state = { ...state, [control.id]: control };
    });
    onAction('removeControl', (controlId) => {
      delete state[controlId];
      state = { ...state };
    });

    onAction('_enable', (controlId) => {
      const newState: ModesControlsAtomState = {};
      Object.entries(state).forEach(([key, modeControl]) => {
        newState[key] = {
          ...modeControl,
          active: modeControl.id === controlId,
        };
        modeControl.onChange?.(modeControl.id === controlId);
      });
      state = newState;
    });

    onChange('currentModeAtom', (mode, prevMode) => {
      schedule((dispatch) => dispatch(create('_enable', mode)));
    });

    return state;
  },
  '[Modes] modesControlsAtom',
);

export type ModesControlsAtom = typeof modesControlsAtom;
