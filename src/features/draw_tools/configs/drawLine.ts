import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawLineStringMode } from "../modes/drawLine";
import Icon from '../icons/iconAtlas.png'
import app_config from "~core/app_config";

// it's supposed to be the type of : MapboxLayerProps<unknown>
// it will work regardless to type errors
export const drawLineDeckLayerConfig = {
  id: drawModes.DrawLineMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawLineStringMode,
  selectedFeatureIndexes: [],
  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    guides: {
      getLineWidth: 4,
      getLineColor: [60, 120, 20, 120],
    },
  },

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: app_config.iconLayer.iconMapping,
  editHandleIconSizeScale: app_config.iconLayer.sizeScale,
  getEditHandlePosition: d => d.coordinates,
  getEditHandleIconSize:() => 1.8,
  getEditHandleIcon: () => "pointIcon",
}