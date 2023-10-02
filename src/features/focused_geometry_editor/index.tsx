import {
  drawModes,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
  FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
} from '~core/draw_tools/constants';
import { activeDrawModeAtom } from '~core/draw_tools/atoms/activeDrawMode';
import { i18n } from '~core/localization';
import { drawModeLogicalLayerAtom } from '~core/draw_tools/atoms/logicalLayerAtom';
import { forceRun } from '~utils/atoms/forceRun';
import { toolboxAtom } from '~core/draw_tools/atoms/toolboxAtom';
import { store } from '~core/store/store';
import { setIndexesForCurrentGeometryAtom } from '~core/draw_tools/atoms/selectedIndexesAtom';
import { toolbar } from '~core/toolbar';
import { isEditorActiveAtom } from './atoms/isEditorActive';
import { focusedGeometryEditorAtom } from './atoms/focusedGeometryEditorAtom';

const toolboxAtomSettings = {
  availableModes: [
    'DrawPolygonMode' as const,
    'DrawLineMode' as const,
    'DrawPointMode' as const,
  ],
  finishButtonCallback: (): Promise<true> =>
    new Promise((res) => {
      focusedGeometryEditorAtom.updateGeometry.dispatch();
      res(true);
    }),
};

export const focusedGeometryControl = toolbar.setupControl({
  id: FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
  borrowMapInteractions: true,
  type: 'button',
  typeSettings: {
    name: FOCUSED_GEOMETRY_EDITOR_CONTROL_NAME,
    hint: i18n.t('focus_geometry.title'),
    icon: 'Poly24',
    preferredSize: 'small',
  },
});

focusedGeometryControl.onInit(() => forceRun(focusedGeometryEditorAtom));
focusedGeometryControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch([
      isEditorActiveAtom.set(true),
      toolboxAtom.setSettings(toolboxAtomSettings),
      drawModeLogicalLayerAtom.enable(),
      activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
      setIndexesForCurrentGeometryAtom.set(true),
    ]);
  } else {
    store.dispatch([
      isEditorActiveAtom.set(false),
      drawModeLogicalLayerAtom.disable(),
      activeDrawModeAtom.setDrawMode(null),
    ]);
  }
});
focusedGeometryControl.onRemove(() => {
  store.dispatch([
    isEditorActiveAtom.set(false),
    drawModeLogicalLayerAtom.disable(),
    activeDrawModeAtom.setDrawMode(null),
  ]);
});

export function initFocusedGeometry() {
  focusedGeometryControl.init();
}
