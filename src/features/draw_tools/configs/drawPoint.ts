import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawPointMode } from "../modes/drawPoint";

// it's supposed to be the type of : MapboxLayerProps<unknown>
// it will work regardless to type errors
export const drawPointDeckLayerConfig = {
  id: drawModes.DrawPointMode,
  type: EditableGeoJsonLayer,
  mode: LocalDrawPointMode,
  selectedFeatureIndexes: [],
  _subLayerProps: {
    guides: {}
  }
}