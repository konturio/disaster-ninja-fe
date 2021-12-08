import { createLogicalLayerAtom } from '~core/logical_layers/createLogicalLayerAtom';
import { BoundarySelectorLayer } from '../layers/BoundarySelectorLayer';
import { BOUNDARY_SELECTOR_LAYER_ID } from '../constants';

export const boundaryLogicalLayerAtom = createLogicalLayerAtom(
  new BoundarySelectorLayer(BOUNDARY_SELECTOR_LAYER_ID),
);
