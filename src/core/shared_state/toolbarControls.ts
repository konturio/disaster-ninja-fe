import { createAtom } from '~utils/atoms';
import type { Action } from '@reatom/core';

type SideControl = {
  id: string;
  name: string;
  icon: JSX.Element | null;
  active: boolean;
  title: string;
  // only one control of a given group can be enabled.
  // Enabling 2nd control from the same group will run `disable` action for the first enabled control
  exclusiveGroup?: string;
  // allows toolbar component to group controls into sections
  visualGroup?: string;
  onClick?: (isActive: boolean) => void;
  onChange?: (isActive: boolean) => void;
};

export const controlGroup = {
  mapTools: 'mapTools',
};

export const controlVisualGroup = {
  withAnalytics: 'withAnalytics',
  noAnalytics: 'noAnalytics',
};

export const toolbarControlsAtom = createAtom(
  {
    addControl: (control: SideControl) => control,
    removeControl: (controlId: string) => controlId,
    toggleActiveState: (controlId: string) => controlId,
    enable: (controlId: string) => controlId,
    disable: (controlId: string) => controlId,
    reset: () => null,
  },
  ({ onAction, schedule, create }, state: Record<string, SideControl> = {}) => {
    onAction('addControl', (control) => {
      state = { ...state, [control.id]: control };
    });
    onAction('removeControl', (controlId) => {
      delete state[controlId];
      state = { ...state };
    });

    onAction('enable', (controlId) => {
      const control = state[controlId];

      control.onChange?.(true);
      const newControlState = { ...state[controlId], active: true };
      const newState = { ...state, [controlId]: newControlState };

      // if there're other controls in exclusive group - turn 'em off
      const disableActions: Action[] = [];

      Object.entries(newState).forEach(([key, ctrl]) => {
        if (ctrl.id === controlId) return;

        if (ctrl.exclusiveGroup === control.exclusiveGroup && ctrl.active) {
          const action = create('disable', ctrl.id);
          disableActions.push(action);
        }
      });

      disableActions.length &&
        schedule((dispatch) => {
          dispatch(disableActions);
        });

      state = newState;
    });

    onAction('disable', (controlId) => {
      const control = state[controlId];

      control?.onChange?.(false);
      const newControlState = { ...state[controlId], active: false };
      state = { ...state, [controlId]: newControlState };
    });

    onAction('toggleActiveState', (controlId) => {
      const control = state[controlId];
      if (!control)
        return console.error(
          `[toolbarControlsAtom] Cannot toggle state for ${controlId} because it doesn't exist`,
        );

      const action = create(state[controlId].active ? 'disable' : 'enable', controlId);

      schedule((dispatch) => dispatch(action));
    });

    onAction('reset', () => {
      // trigger disable callbacks before reset
      Object.entries(state).forEach(([key, control]) => {
        if (control.active) control.onChange?.(false);
      });
      state = {};
    });

    return state;
  },
  '[Shared state] toolbarControlsAtom',
);
