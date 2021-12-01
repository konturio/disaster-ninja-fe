import { MapboxLayerProps } from "@deck.gl/mapbox/mapbox-layer";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { AnyLayer } from "maplibre-gl";
import { drawModes } from "../constants";
import { ModifyMode } from "../modes/modifyMode";


export const modifyDeckLayerConfig: MapboxLayerProps<unknown> = {
  id: drawModes.ViewMode,
  type: EditableGeoJsonLayer,
  mode: ModifyMode,
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