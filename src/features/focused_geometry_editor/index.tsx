import { Poly24 } from '@konturio/default-icons';
import { toolbarControlsAtom } from '~core/shared_state';
import {
  drawModes,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
} from '~core/draw_tools/constants';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { forceRun } from '~utils/atoms/forceRun';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { store } from '~core/store/store';
import { isEditorActiveAtom } from './atoms/isEditorActive';
import { focusedGeometryEditorAtom } from './atoms/focusedGeometryEditorAtom';

export function initFocusedGeometry() {
  forceRun(focusedGeometryEditorAtom);

  toolbarControlsAtom.addControl.dispatch({
    id: FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
    name: FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
    title: i18n.t('focus_geometry.title'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <Poly24 />,
    onClick: () => {
      toolbarControlsAtom.toggleActiveState.dispatch(FOCUSED_GEOMETRY_EDITOR_CONTROL_ID);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        store.dispatch([
          isEditorActiveAtom.set(true),
          toolboxAtom.setSettings({
            availableModes: ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode'],
            finishButtonCallback: () =>
              new Promise((res) => {
                focusedGeometryEditorAtom.updateGeometry.dispatch();
                res(true);
              }),
          }),
          drawModeLogicalLayerAtom.enable(),
          activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
        ]);
        // TODO fix that logic in layer.setMode() in #9782
        store.dispatch(activeDrawModeAtom.setDrawMode(drawModes.DrawPolygonMode));
      } else {
        store.dispatch([
          isEditorActiveAtom.set(false),
          drawModeLogicalLayerAtom.disable(),
          activeDrawModeAtom.setDrawMode(null),
        ]);
      }
    },
  });
}
