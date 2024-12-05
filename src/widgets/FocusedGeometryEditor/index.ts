import { drawTools } from '~core/draw_tools';
import { toolbar } from '~core/toolbar';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { store } from '~core/store/store';
import { FeatureCollection, isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { FOCUSED_GEOMETRY_EDITOR_CONTROL_ID } from './constants';
import { DrawToolsWidget } from './DrawToolsWidget';

export const focusedGeometryControl = toolbar.setupControl({
  id: FOCUSED_GEOMETRY_EDITOR_CONTROL_ID,
  borrowMapInteractions: true,
  type: 'widget',
  typeSettings: {
    component: DrawToolsWidget,
  },
});

focusedGeometryControl.onStateChange(async (ctx, state, prevState) => {
  if (state === 'active') {
    try {
      // Read focused geometry
      const focusedGeometry =
        focusedGeometryAtom.getState()?.geometry ?? new FeatureCollection([]);
      store.dispatch(
        // Disable focused geometry layer
        enabledLayersAtom.delete(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID),
      );
      // Put focused geometry to editor
      const result = await drawTools.edit(focusedGeometry);
      if (!isGeoJSONEmpty(result)) {
        store.dispatch([
          // Update focused geometry with edited geometry
          focusedGeometryAtom.setFocusedGeometry({ type: 'drawn' }, result),
        ]);
      } else {
        // draw tools returned an empty geometry -> reset focused geometry
        store.dispatch([focusedGeometryAtom.reset()]);
      }
    } catch (e) {
      console.error('Draw tools exited with error:', e);
    } finally {
      // Re-enable focused geometry layer
      store.dispatch([enabledLayersAtom.set(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID)]);
    }
  } else if (prevState === 'active') {
    // TODO
    // const agree = window.confirm(i18n('focused_geometry_editor.exit_confirmation'));
    // if (agree)
    // const geometry = drawTools.geometry;
    drawTools.exit();
  }
});

focusedGeometryControl.onRemove(() => {
  drawTools.exit();
});

export function initFocusedGeometry() {
  focusedGeometryControl.init();
}
