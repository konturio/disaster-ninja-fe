import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawLineStringMode } from "../modes/drawLine";

// it's supposed to be the type of : MapboxLayerProps<unknown>
// it will work regardless to type errors
export const drawLineDeckLayerConfig = {
  id: drawModes.DrawLineMode,
  type: EditableGeoJsonLayer,
  // typescript marks this as error. Yet the mode works on map.
  mode: LocalDrawLineStringMode,
  selectedFeatureIndexes: [],
  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    guides: {
      getLineWidth: 4,
      getLineColor: [30, 70, 10, 160],
    },
  },

}