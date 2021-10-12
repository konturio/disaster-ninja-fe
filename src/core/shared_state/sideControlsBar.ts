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
  ({ onAction }, state: SideControl[] = []) => {
    onAction('addControl', (control) => (state = [...state, control]));
    onAction(
      'removeControl',
      (controlId) =>
        (state = state.filter((control) => control.id !== controlId)),
    );
    onAction(
      'toggleActiveState',
      (controlId) =>
        (state = state.map((control) =>
          control.id !== controlId
            ? control
            : { ...control, active: !control.active },
        )),
    );
    return state;
  },
);
