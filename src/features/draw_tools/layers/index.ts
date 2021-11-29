import { DrawModeType } from "../constants"
import { drawPolyDeckLayerConfig } from "./drawPolyLayer"


export const layersConfigs: {
  [key in DrawModeType]?: any
} = {
  DrawPolygonMode: drawPolyDeckLayerConfig
}