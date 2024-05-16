import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import { store } from '~core/store/store';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { applyNewGeometryLayerSource } from '~core/logical_layers/utils/applyNewGeometryLayerSource';
import {
  FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
  FOCUSED_GEOMETRY_COLOR,
} from './constants';
import { FocusedGeometryRenderer } from './renderers/FocusedGeometryRenderer';

let isInitialized = false;

export function initFocusedGeometryLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // when focusedGeometryAtom updates, we create a new reference area layer source
  store.v3ctx.subscribe(focusedGeometryAtom.v3atom, (focusedGeometry) => {
    applyNewGeometryLayerSource(
      FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
      focusedGeometry?.geometry ?? null,
    );
  });

  registerNewGeometryLayer(
    FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
    new FocusedGeometryRenderer({
      id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    }),
    FOCUSED_GEOMETRY_COLOR,
  );
}
