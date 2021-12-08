import { focusedGeometryAtom } from '~core/shared_state';
import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import {
  FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
  FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
} from '../constants';
import { FocusedGeometryLayer } from '../layers/FocusedGeometryLayer';

export const focusedGeometryLayerAtom = createLogicalLayerAtom(
  new FocusedGeometryLayer({
    id: FOCUSED_GEOMETRY_LOGICAL_LAYER_ID,
    name: FOCUSED_GEOMETRY_LOGICAL_LAYER_TRANSLATION_KEY,
  }),
  focusedGeometryAtom,
);
