import { EditAction, FeatureCollection } from "@nebula.gl/edit-modes";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawnGeometryAtom } from "../atoms/drawnGeometryAtom";
import { drawModes } from "../constants";
import { LocalModifyMode } from "../modes/modifyMode";
import { CustomModifyMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomModifyMode';
import { activeDrawModeAtom } from "../atoms/activeDrawMode";
import { modeWatcherAtom } from "../atoms/drawLayerAtom";
import { currentMapAtom } from "~core/shared_state";


// movePosition - we should only do it after keyup
const completedTypes = ['selectFeature', 'finishMovePosition', 'rotated', 'translated']
export const modifyDeckLayerConfig = {
  id: drawModes.ModifyMode,
  type: EditableGeoJsonLayer,
  mode: LocalModifyMode,
  // selectedFeatureIndexes: [], //0 to select firts feature
  // data,

  parameters: {
    depthTest: false, // skip z-buffer check
    pickingRadius: 50
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

}


// https://deck.gl/docs/api-reference/layers/geojson-layer#data