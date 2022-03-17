import { DRAW_TOOLS_LAYER_ID } from '../constants';
import { createLogicalLayerAtom } from '~core/logical_layers/utils/logicalLayerFabric';
import { DrawModeRenderer } from '../renderers/DrawModeRenderer';

export const drawModeRenderer = new DrawModeRenderer(DRAW_TOOLS_LAYER_ID);

export const drawModeLogicalLayerAtom = createLogicalLayerAtom(
  DRAW_TOOLS_LAYER_ID,
  drawModeRenderer,
);
