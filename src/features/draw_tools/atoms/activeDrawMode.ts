import { createAtom } from '@reatom/core';
import { sideControlsBarAtom } from '~core/shared_state';
import { DRAW_TOOLS_CONTROLS, defaultPolygonSelectionMode } from '../constants';

type Unpacked<T> = T extends (infer U)[] ? U : T;
type DrawModes = Unpacked<typeof DRAW_TOOLS_CONTROLS>;

export const activeDrawModeAtom = createAtom(
  { sideControlsBarAtom, resetDrawMode: () => null },
  ({ onChange, onAction }, state: DrawModes = defaultPolygonSelectionMode) => {
    onChange('sideControlsBarAtom', (controls) => {
      const enabledDrawControl = Object.values(controls).find(
        (control) =>
          control.active &&
          DRAW_TOOLS_CONTROLS.includes(control.id as DrawModes),
      );

      if (enabledDrawControl) {
        state = enabledDrawControl.id as DrawModes;
      } else {
        state = defaultPolygonSelectionMode;
      }
    });

    onAction('resetDrawMode', () => {
      state = defaultPolygonSelectionMode;
    });

    return state;
  },
);
