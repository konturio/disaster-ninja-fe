import { Map } from 'maplibre-gl';

type LayersTypes =
  | 'symbol'
  | 'background'
  | 'circle'
  | 'fill-extrusion'
  | 'fill'
  | 'heatmap'
  | 'hillshade'
  | 'line'
  | 'raster'
  | 'custom';

export class LayersOrderManager {
  _baseMapFirstLayerIdx: number | null = null;
  _map: Map | null = null;
  _orderByType: LayersTypes[] = [
    'custom',
    'symbol',
    'circle',
    'line',
    'fill-extrusion',
    'fill',
    'heatmap',
    'hillshade',
    'raster',
    'background',
  ];

  init(map: Map) {
    this._map = map;
    map.once('load', () => {
      this._baseMapFirstLayerIdx = (map.getStyle().layers ?? []).length - 1;
    });
  }

  getBeforeIdByType(type: LayersTypes) {
    const map = this._map;
    if (map === null) throw new Error('LayersOrderManager not ready');
    const allLayers = map.getStyle().layers ?? [];
    const layers = allLayers.slice(this._baseMapFirstLayerIdx! + 1);
    let n = 0;
    let firstLayerWithSameType: string | undefined;
    const firstIndexOfType = {};
    while (n < layers.length) {
      if (layers[n].type === type) {
        firstLayerWithSameType = layers[n].id;
        break;
      } else {
        if (firstIndexOfType[layers[n].type] === undefined) {
          firstIndexOfType[layers[n].type] = n;
        }
      }
      n++;
    }

    if (firstLayerWithSameType) {
      return firstLayerWithSameType;
    }

    const closestTypeLayerIdx = this._orderByType
      .slice(this._orderByType.indexOf(type) + 1)
      .find((t) => firstIndexOfType[t]);

    if (closestTypeLayerIdx) {
      return layers[closestTypeLayerIdx].id;
    }

    return layers[0]?.id;
  }
}

export const layersOrderManager = new LayersOrderManager();
