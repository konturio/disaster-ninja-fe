import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalModifyMode } from "../modes/modifyMode";


export const modifyDeckLayerConfig = {
  id: drawModes.ModifyMode,
  type: EditableGeoJsonLayer,
  mode: LocalModifyMode,
  parameters: {
    depthTest: false, // skip z-buffer check
    pickingRadius: 750
  },
  _subLayerProps: {
    tooltips: {
      // getSize: () => 20,
    },
    guides: {
      getFillColor: [30, 60, 20, 120],
      getLineWidth: 2,
      getLineColor: [20, 20, 10, 140],
    },
    geojson: {
      getFillColor: () => [60, 20, 20, 100],
      getLineColor: [150, 10, 20, 180],
      stroked: true
    },
  },
  // editHandleType: 'icon',  //starts search for icons. However it's unknown where to put these props https://deck.gl/docs/api-reference/layers/icon-layer
}


// https://deck.gl/docs/api-reference/layers/geojson-layer#data