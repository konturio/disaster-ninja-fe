import { EditAction, FeatureCollection } from "@nebula.gl/edit-modes";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawnGeometryAtom } from "../atoms/drawnGeometryAtom";
import { drawModes } from "../constants";
import { ModifyMode } from "../modes/modifyMode";
import { CustomModifyMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomModifyMode';




export const modifyDeckLayerConfig = {
  id: drawModes.ModifyMode,
  type: EditableGeoJsonLayer,
  mode: CustomModifyMode,
  // be shure to pass array, the modes do not expect non iterable value

  // empty means nothing can be selected
  // the question is shall we pass the number from higher up or change it 
  selectedFeatureIndexes: [], //0 to select firts feature

  onEdit: ({ editContext, updatedData, editType }: EditAction<FeatureCollection>): any => {
    // console.log('%c⧭ editType', 'color: #cc0088', editType, editContext.featureIndexes);
    // this works for one at a time feature selected editing
    console.log('%c⧭ update by ', 'color: #735656', updatedData.features[0]);
    drawnGeometryAtom.updateFeature.dispatch(editContext.featureIndexes[0], updatedData.features[0])
    return null
  },
  // typescript marks this as error. Yet this collection drawn on map
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
      stroked: true,
    },
    geojson: {
      getFillColor: (feature) => [0x66, 0x00, 0xff],
      getLineColor: (feature) => [0xff, 0x66, 0x00, 0xff],
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