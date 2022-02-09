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

  init(map: MapLibre) {
    this._map = map;
    map.once('load', () => {
      this._baseMapFirstLayerIdx = (map.getStyle().layers ?? []).length - 1;
    });
  }

  getBeforeIdByType(type: LayersTypes) {
    const map = this._map;
    if (map === null) throw new Error('LayersOrderManager not ready');
    if (this._baseMapFirstLayerIdx === null)
      throw new Error('BaseMap style not loaded yet');

    // Take all custom layers
    const allLayers = map.getStyle().layers ?? [];
    // This is first layer
    if (allLayers.length === 0) {
      return undefined;
    }

    const layers = allLayers.slice(this._baseMapFirstLayerIdx! + 1);
    // This is first custom layer

    if (layers.length === 0) {
      // return upper basemap layer
      if (allLayers[this._baseMapFirstLayerIdx]) {
        return allLayers[this._baseMapFirstLayerIdx].id;
      }
      console.error(
        'Basemap style was changed, and old indexes not available anymore',
      );
      return undefined;
    }

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
}

export const layersOrderManager = new LayersOrderManager();
