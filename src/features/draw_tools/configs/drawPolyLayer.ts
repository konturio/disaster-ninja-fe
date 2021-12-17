import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawPolygonMode } from "../modes/drawPolygon";

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
      getFillColor: [180, 222, 80, 150],
      getLineWidth: 3,
      getLineColor: [20, 50, 5, 100],
      // not working but should https://github.com/uber/nebula.gl/blob/master/docs/api-reference/layers/editable-geojson-layer.md
      getEditHandlePointColor: () => [220, 10, 10, 220],
      getEditHandlePointOutlineColor: [220, 10, 10, 140]
    },
  },
  modeConfig: {
    multipoint: true,
    disableSelfIntersections: true
  },

}