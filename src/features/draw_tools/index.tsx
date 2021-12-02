import { sideControlsBarAtom } from '~core/shared_state';
import {
  DRAW_TOOLS_CONTROL_ID,
  DRAW_TOOLS_CONTROL_NAME,
  drawModes,
} from '~features/draw_tools/constants';
import { activeDrawModeAtom } from '~features/draw_tools/atoms/activeDrawMode';
import { DrawToolsIcon } from '@k2-packages/default-icons';
import { controlGroup, controlVisualGroup } from '~core/shared_state/sideControlsBar';

export function initDrawTools() {
  sideControlsBarAtom.addControl.dispatch({
    id: DRAW_TOOLS_CONTROL_ID,
    name: DRAW_TOOLS_CONTROL_NAME,
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalitics,
    icon: <DrawToolsIcon />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(DRAW_TOOLS_CONTROL_ID);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        activeDrawModeAtom.setDrawMode.dispatch(drawModes.ViewMode);
      } else {
        activeDrawModeAtom.setDrawMode.dispatch(undefined);
      }
    },
  });
}
