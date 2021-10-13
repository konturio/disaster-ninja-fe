import { createAtom } from '@reatom/core';

export interface SideControl {
  id: string;
  name: string;
  icon: JSX.Element;
  active: boolean;
  group: string;
  onClick: () => void;
}

export const sideControlsBarAtom = createAtom(
  {
    addControl: (control: SideControl) => control,
    removeControl: (controlId: string) => controlId,
    toggleActiveState: (controlId: string) => controlId,
  },
  ({ onAction }, state: Record<string, SideControl> = {}) => {
    onAction(
      'addControl',
      (control) => (state = { ...state, [control.id]: control }),
    );
    onAction('removeControl', (controlId) => {
      delete state[controlId];
      state = { ...state };
    });
    onAction('toggleActiveState', (controlId) => {
      if (state[controlId]) {
        state[controlId].active = !state[controlId].active;
        state = { ...state };
      } else {
        console.error(
          `[sideControlsBarAtom] Cannot toggle state for ${controlId} because it not exist`,
        );
      }
    });
    return state;
  },
);
