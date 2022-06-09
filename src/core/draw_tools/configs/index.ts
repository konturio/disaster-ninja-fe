import { drawLineDeckLayerConfig } from './drawLine';
import { drawPointDeckLayerConfig } from './drawPoint';
import { drawPolyDeckLayerConfig } from './drawPolyLayer';
import { modifyDeckLayerConfig } from './modifyLayer';
import type { DrawModeType } from '../constants';

export const layersConfigs: {
  [key in DrawModeType]?: any;
} = {
  DrawPolygonMode: drawPolyDeckLayerConfig,
  ModifyMode: modifyDeckLayerConfig,
  DrawLineMode: drawLineDeckLayerConfig,
  DrawPointMode: drawPointDeckLayerConfig,
};
