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

// The actual mapbox layers are drawn in natural order. E.g. ['basmap', 'rasterLayer', 'pointLayer']
// The latter layers overlaps previous layers
export class LayersOrderManager {
  _baseMapFirstLayerIdx: number | null = null;
  _map: MapLibre | null = null;
  _typesOrder: LayersTypes[] = [
    'background',
    'raster',
    'hillshade',
    'heatmap',
    'fill',
    'fill-extrusion',
    'line',
    'circle',
    'symbol',
    'custom',
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

  _getBeforeIdByTypeSync(map: MapLibre, type: LayersTypes): string | undefined {
    if (this._baseMapFirstLayerIdx === null) return;
    if (!this._typesOrder.includes(type)) {
      console.error(
        `${type} is not supported type. If you want to work with it add it to layers order manager`,
      );
    }
    // Take all layers
    const allLayers = map.getStyle().layers ?? [];
    // Check for the first layer
    if (allLayers.length === 0) {
      return undefined;
    }

    const customLayers = allLayers.slice(this._baseMapFirstLayerIdx! + 1);

    // Check for the first custom layer
    // return undefined so it wouldn't draw under the basemap
    if (!customLayers.length) return undefined;

    // Create map { type: upper layer with this type }
    const mountedLayersByType = new Map<LayersTypes, maplibregl.AnyLayer>();
    let n = 0;
    // this loop will come from bottom to top layers
    while (n < customLayers.length) {
      const layer = customLayers[n];
      // set the lowest layer for it's type
      if (!mountedLayersByType.has(layer.type)) {
        mountedLayersByType.set(layer.type, layer);
      }
      n++;
    }

    const higherMountedType = this._typesOrder
      // get all higher types
      .slice(this._typesOrder.indexOf(type) + 1)
      // find closest of them that exists on map
      .find((t) => mountedLayersByType.has(t));

    // if there's no higher type mounted - return undefined and mount layer on top
    if (!higherMountedType) return;
    // if higher type is mounted, get it's bottom layer's id to mount underneath it
    return mountedLayersByType.get(higherMountedType)?.id;
  }

  getBeforeIdByType(
    type: LayersTypes,
    cb: (id: string | undefined) => void,
  ): void {
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
