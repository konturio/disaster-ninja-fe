import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawPolygonMode } from "../modes/drawPolygon";
import Icon from '../icons/iconAtlas.png'
import app_config from "~core/app_config";

// it's supposed to be the type of : MapboxLayerProps<unknown>
// it will work regardless to type errors
export const drawPolyDeckLayerConfig = {
  id: drawModes.DrawPolygonMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawPolygonMode,
  selectedFeatureIndexes: [],
  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    guides: {
      getFillColor: [40, 150, 20, 70],
      getLineWidth: 3,
      getLineColor: [60, 120, 20, 120],
      // not working but should https://github.com/uber/nebula.gl/blob/master/docs/api-reference/layers/editable-geojson-layer.md
      getEditHandlePointColor: [12, 155, 237, 255],
      getEditHandlePointOutlineColor: [12, 155, 237, 255],
      handlePointColor: [12, 155, 237, 255],
      pointColor: [12, 155, 237, 255],
    },
  },
  modeConfig: {
    multipoint: true,
    disableSelfIntersections: true
  },

  editHandleType: 'icon',
  editHandleIconAtlas: Icon,
  editHandleIconMapping: app_config.iconLayer.iconMapping,
  editHandleIconSizeScale: app_config.iconLayer.sizeScale,
  getEditHandlePosition: d => d.coordinates,
  getEditHandleIconSize:() => 1.8,
  getEditHandleIcon: () => "pointIcon",
}