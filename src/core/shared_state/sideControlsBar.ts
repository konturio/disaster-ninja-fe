import { createBindAtom } from '~utils/atoms/createBindAtom';

export interface SideControl {
  id: string;
  name: string;
  icon: JSX.Element;
  active: boolean;
  group: string;
  onClick?: (isActive: boolean) => void;
  onChange?: (isActive: boolean) => void;
}


export const controlGroup = {
  mapTools: 'mapTools'
}

export const sideControlsBarAtom = createBindAtom(
  {
    addControl: (control: SideControl) => control,
    removeControl: (controlId: string) => controlId,
    toggleActiveState: (controlId: string) => controlId,
    enable: (controlId: string) => controlId,
    disable: (controlId: string) => controlId,
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

    onAction('enable', (controlId) => {
      if (state[controlId]) {
        const onChange = state[controlId].onChange;
        onChange && onChange(true);
        const newControlState = { ...state[controlId], active: true };
        state = { ...state, [controlId]: newControlState };
      } else {
        console.error(
          `[sideControlsBarAtom] Cannot toggle state for ${controlId} because it not exist`,
        );
      }
    });

    onAction('disable', (controlId) => {
      if (state[controlId]) {
        const onChange = state[controlId].onChange;
        onChange && onChange(false);
        const newControlState = { ...state[controlId], active: false };
        state = { ...state, [controlId]: newControlState };
      } else {
        console.error(
          `[sideControlsBarAtom] Cannot toggle state for ${controlId} because it not exist`,
        );
      }
    });

    onAction('toggleActiveState', (controlId) => {
      const control = state[controlId]
      if (!control) return console.error(
        `[sideControlsBarAtom] Cannot toggle state for ${controlId} because it doesn't exist`,
      );

      const activity = !state[controlId].active
      control.onChange?.(activity)

      const newControlState = {
        ...state[controlId],
        active: activity,
      };

      const newState = { ...state, [controlId]: newControlState }

      // only one mapTools control can be active. Let's check it
      if (control.group === controlGroup.mapTools && activity) {
        Object.entries(newState).forEach(([key, ctrl]) => {
          if (ctrl.group === controlGroup.mapTools && ctrl.id !== controlId && ctrl.active) {
            newState[key].active = false
            newState[key].onChange?.(false);
          }
        })
      }

      return state = newState
    });

    return state;
  },
  '[Shared state] sideControlsBarAtom',
);
