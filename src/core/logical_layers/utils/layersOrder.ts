import { Map as MapLibre } from 'maplibre-gl';

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
  _map: MapLibre | null = null;
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

  _awaitingTasks = new Set<(map: MapLibre) => void>();

  init(map: MapLibre) {
    this._map = map;
    map.once('load', () => {
      this._baseMapFirstLayerIdx = (map.getStyle().layers ?? []).length - 1;
      this._awaitingTasks.forEach((task) => {
        this._awaitingTasks.delete(task);
        task(map);
      });
    });
  }

  _getBeforeIdByTypeSync(map: MapLibre, type: LayersTypes) {
    if (this._baseMapFirstLayerIdx === null) return;
    // Take all custom layers
    const allLayers = map.getStyle().layers ?? [];
    // This is first layer
    if (allLayers.length === 0) {
      return undefined;
    }

    const layers = allLayers.slice(this._baseMapFirstLayerIdx! + 1);

    // This is first custom layer
    // return undefined so it wouldn't draw under the basemap
    if (!layers.length) return undefined;

    // Create map { type: upper layer with this type }
    const upperLayers = new Map();
    let n = 0;
    while (n < layers.length) {
      const layer = layers[n];
      if (!upperLayers.has(layer.type)) {
        upperLayers.set(layer.type, layer);
      }
      n++;
    }

    // Return upper layers with same type
    if (upperLayers.has(type)) {
      return upperLayers.get(type).id;
    }

    // In case this is first layer with this type
    // return first layer of prev type
    const prevType = this._orderByType
      // cut off prev types
      .slice(this._orderByType.indexOf(type) + 1)
      .find((t) => upperLayers.has(t));

    if (prevType) {
      return upperLayers.get(prevType).id;
    }

    // In case no layers even in more lower types
    // Return upper custom layer
    if (layers[0]?.id) {
      return layers[0].id;
    }

    console.error('Unexpected case in layer sorting');
    return undefined;
  }

  getBeforeIdByType(type: LayersTypes, cb: (id: string) => void): void {
    const map = this._map;
    if (map === null || this._baseMapFirstLayerIdx === null) {
      this._awaitingTasks.add((map) => {
        cb(this._getBeforeIdByTypeSync(map, type));
      });
    } else {
      // Wait all sync tasks
      cb(this._getBeforeIdByTypeSync(map, type));
    }
  }
}

export const layersOrderManager = new LayersOrderManager();
