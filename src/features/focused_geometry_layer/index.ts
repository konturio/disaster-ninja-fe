import { forceRun } from '~utils/atoms/forceRun';
import { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } from '~core/focused_geometry/constants';
import { registerNewGeometryLayer } from '~core/logical_layers/utils/registerNewGeometryLayer';
import {
  FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
  FOCUSED_GEOMETRY_COLOR,
} from './constants';
import { createFocusedGeometrySourceAtom } from './atoms/focusedGeometrySourceAtom';
import { FocusedGeometryRenderer } from './renderers/FocusedGeometryRenderer';

let isInitialized = false;

export function initFocusedGeometryLayer() {
  if (isInitialized) return;
  isInitialized = true;

  // Connect layer source with focused geometry
  forceRun(createFocusedGeometrySourceAtom(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID));

  registerNewGeometryLayer(
    FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
    new FocusedGeometryRenderer({
      id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    }),
    FOCUSED_GEOMETRY_COLOR,
  );
}
