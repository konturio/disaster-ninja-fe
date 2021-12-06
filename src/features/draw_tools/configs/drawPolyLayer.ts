import { MapboxLayerProps } from "@deck.gl/mapbox/mapbox-layer";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawPolygonMode } from "../modes/drawPolygon";
import { EditAction, FeatureCollection } from "@nebula.gl/edit-modes";
import { drawnGeometryAtom } from '../atoms/drawnGeometryAtom';

// it's supposed to be the type of : MapboxLayerProps<unknown>
// it will work regardless to type errors
export const drawPolyDeckLayerConfig: MapboxLayerProps<unknown> = {
  id: drawModes.DrawPolygonMode,
  type: EditableGeoJsonLayer,
  // typescript marks this as error. Yet the mode works on map.
  mode: LocalDrawPolygonMode,
  selectedFeatureIndexes: [],
  onEdit: ({ editContext, updatedData, editType }: EditAction<FeatureCollection>): any => {
    if (editType === 'addFeature' && updatedData.features[0])
      drawnGeometryAtom.addFeature.dispatch(updatedData.features[0]);
  },
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
      getFillColor: () => [0xff, 0x66, 0x00, 0xff],
      getLineWidth: () => 2,
      stroked: false,
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