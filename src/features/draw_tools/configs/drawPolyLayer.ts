import { MapboxLayerProps } from "@deck.gl/mapbox/mapbox-layer";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { drawModes } from "../constants";
import { LocalDrawPolygonMode } from "../modes/drawPolygon";

const exampleGeo = {
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [
          53.24676749999969,
          73.844393544434
        ],
        [
          82.4967717915341,
          58.9228002926334
        ],
        [
          25.965515354232487,
          58.63121797209951
        ],
        [
          25.824892499999685,
          58.63121797209951
        ],
        [
          53.24676749999969,
          73.844393544434
        ]
      ]
    ]
  },
  "type": "Feature",
  "properties": {}
}
const myFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    exampleGeo
  ],
};

export const drawPolyDeckLayerConfig: MapboxLayerProps<unknown> = {
  id: drawModes.DrawPolygonMode,
  type: EditableGeoJsonLayer,
  // typescript marks this as error. Yet the mode works on map.
  mode: LocalDrawPolygonMode,
  // typescript marks this as error. Yet this collection drawn on map
  data: myFeatureCollection,
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