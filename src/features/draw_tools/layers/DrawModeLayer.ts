import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
// import { CustomDrawPolygonMode } from '@k2-packages/map-draw-tools/tslib/customDrawModes/CustomDrawPolygonMode';
import { MapboxLayer } from '@deck.gl/mapbox';
import { LogicalLayer } from '~utils/atoms/createLogicalLayerAtom';
import { layersOrderManager } from '~core/layersOrder';
// import { handleClick } from './handleClick';
import { LocalDrawPolygonMode } from '../modes/drawPolygon';
import { drawModes, DrawModeType } from '../constants';
import { drawPolyDeckLayerConfig } from '../configs/drawPolyLayer';
import { layersConfigs } from '../configs';
import { MapboxLayerProps } from '@deck.gl/mapbox/mapbox-layer';

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

const logicalLayerID = 'draw-mode-logical-layer'
const logicalSourceID = 'draw-mode-logical-source'


type mountedDeckLayersType = {
  [key in DrawModeType]?: MapboxLayer<unknown>
}

export class DrawModeLayer implements LogicalLayer {
  public readonly id: string;
  public readonly name?: string;
  public mountedDeckLayers: mountedDeckLayersType
  public geometry: any[]
  private _isMounted = false;
  private _map!: ApplicationMap

  public constructor(id: string, name?: string) {
    this.id = id;
    this.mountedDeckLayers = {}
    this.geometry = [exampleGeo]
    if (name) {
      this.name = name;
    }
  }

  get isMounted(): boolean {
    return this._isMounted;
  }

  public onInit() {
    return { isVisible: true, isLoading: false };
  }

  willMount(map: ApplicationMap): void {
    this._map = map
    this._isMounted = true;
    this.addDeckLayer(drawModes.ViewMode)
  }

  willUnmount(): void {
    const keys = Object.keys(this.mountedDeckLayers) as Array<DrawModeType>
    keys.forEach((key) => this.removeDeckLayer(key))
    this._isMounted = false;
  }

  // on logic layer mount - add watch/edit deck layer mode
  addDeckLayer(type: DrawModeType): void {
    if (this.mountedDeckLayers[type]) return console.log(`cannot add ${type} as it's already mounted`);

    const config: MapboxLayerProps<unknown> = layersConfigs[type]
    const deckLayer = new MapboxLayer(config)
    const beforeId = layersOrderManager.getBeforeIdByType(deckLayer.type);

    if (!this._map.getLayer(deckLayer.id)?.id)
      this._map.addLayer(deckLayer, beforeId);

    this.mountedDeckLayers[type] = deckLayer
  }

  removeDeckLayer(type: DrawModeType): void {
    const deckLayer = this.mountedDeckLayers[type]
    if (!deckLayer) return console.log(`cannot remove ${type} as it wasn't mounted`);

    this._map.removeLayer(deckLayer.id)
    delete this.mountedDeckLayers[type]
  }

  addGeometry(geometry) {
    this.geometry.push(geometry)
    this._map.addSource(layersConfigs.ViewMode + '-source', {
      'type': 'geojson',
      'data': {
        'type': 'FeatureCollection',
        'features': [
          {
            'type': 'Feature',
            'geometry': {
              'type': 'Polygon',
              'coordinates': [
                [
                  [
                    51.27801535423255,
                    74.75736924099657
                  ],
                  [
                    64.21552179153421,
                    63.64235944358494
                  ],
                  [
                    26.528017499999784,
                    55.89503096872798
                  ],
                  [
                    26.528017499999784,
                    55.97379963336789
                  ],
                  [
                    51.27801535423255,
                    74.75736924099657
                  ]
                ]
              ]
            },
            properties: {}
          },
        ]
      }
    });
    // map.add features
  }

  willHide() { }
  willUnhide() { }
}
