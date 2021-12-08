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
  selectedFeatureIndexes: [0],
  onEdit({ editContext, updatedData, editType }: EditAction<FeatureCollection>): any {
    console.log('%c⧭ editType', 'color: #cc0088', editType, editContext.featureIndexes);
    // console.log('%c⧭', 'color: #cc0036', editContext, updatedData);
    // this works for one at a time feature selected editing

    // this.selectedFeatureIndexes = editContext.featureIndexes -- readonly

    // TODO we need to perform this only when we're not in Modify mode
    if (editContext.featureIndexes.length) {
      modeWatcherAtom.setFocusedIndexes.dispatch(editContext.featureIndexes)
      activeDrawModeAtom.setDrawMode.dispatch(drawModes.ModifyMode)
    }
    
    if (updatedData.features?.[0] && completedTypes.includes(editType)) {
      drawnGeometryAtom.updateFeature.dispatch(editContext.featureIndexes[0], updatedData.features[0])
      currentMapAtom.setInteractivity.dispatch(true)
    } else if (updatedData.features?.[0]) {
      drawnGeometryAtom.updateFeature.dispatch(editContext.featureIndexes[0], updatedData.features[0])
      currentMapAtom.setInteractivity.dispatch(false)
    }
  },
  // data,

  parameters: {
    depthTest: false, // skip z-buffer check
  },
  _subLayerProps: {
    tooltips: {
      // getSize: () => 20,
    },
    guides: {
      // getRadius: () => {
      //   const zoom = map.getZoom();
      //   return 20000 / (zoom * zoom);
      // },
      getFillColor: () => [0x66, 0x00, 0xff],
      getLineWidth: () => 3,
      getTentativeFillColor: () => [255, 0, 255, 100],
      getTentativeLineColor: () => [0, 0, 255, 255],
      stroked: true,
    },
    geojson: {
      getFillColor: () => [0x66, 0x00, 0xff],
      getLineColor: () => [0xff, 0x66, 0x00, 0xff],
    },
  },
  modeConfig: {
    multipoint: true,
    // turfOptions: { units: 'kilometers' },
    // formatTooltip: (distance: number) => {
    //   const km = translationService.t('km');
    //   const m = translationService.t('m');
    //   const distanceLabel =
    //     distance > 1
    //       ? `${distance.toFixed(1)} ${km}.`
    //       : `${(distance * 1000).toFixed(2)} ${m}.`;
    //   const filler = new Array(distanceLabel.length + 2).join(' ');
    //   return `${distanceLabel}${filler}`;
    // },
  },

}


// https://deck.gl/docs/api-reference/layers/geojson-layer#data