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

export const sideControlsBarAtom = createBindAtom(
  {
    addControl: (control: SideControl) => control,
    removeControl: (controlId: string) => controlId,
    toggleActiveState: (controlId: string, exceptions?: string[] | null) => { return { controlId, exceptions } },
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

    onAction('toggleActiveState', ({ controlId, exceptions }) => {
      if (state[controlId]) {
        const onChange = state[controlId].onChange;
        onChange && onChange(!state[controlId].active);
        const newControlState = {
          ...state[controlId],
          active: !state[controlId].active,
        };
        if (exceptions) {
          const newState = { ...state, [controlId]: newControlState }
          exceptions.forEach(exceptionId => {
            const exception = newState[exceptionId]
            if (!exception) return console.error(
              `[sideControlsBarAtom] Cannot run exception for ${controlId} because it doesn't exist`,
            );
            exception.active = false
            exception.onChange?.(false);
          })
          return state = newState
        }
        state = { ...state, [controlId]: newControlState };
      } else {
        console.error(
          `[sideControlsBarAtom] Cannot toggle state for ${controlId} because it doesn't exist`,
        );
      }
    });
    return state;
  },
  '[Shared state] sideControlsBarAtom',
);
