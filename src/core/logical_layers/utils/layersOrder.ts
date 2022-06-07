import type { Map as MapLibre } from 'maplibre-gl';

export type LayersType =
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
export const layerTypesOrdered: LayersType[] = [
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
export class LayersOrderManager {
  private _baseMapFirstLayerIdx: number | null = null;
  private _map: MapLibre | null = null;
  private _typesOrder: LayersType[] = [...layerTypesOrdered];

  private _awaitingTasks = new Set<(map: MapLibre) => void>();

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

  getIdToMountOnTypesTop(
    type: LayersType,
    cb: (id: string | undefined) => void,
  ): void {
    this._asyncWrap(type, cb, this._getIdToMountOnTypesTopSync.bind(this));
  }

  getIdToMountOnTypesBottom(
    type: LayersType,
    cb: (id: string | undefined) => void,
  ) {
    this._asyncWrap(type, cb, this._getIdToMountOnTypesBottomSync.bind(this));
  }

  _getIdToMountOnTypesTopSync(
    map: MapLibre,
    type: LayersType,
  ): string | undefined {
    // now mountedLayersByType has lowest layers for it's type
    // that's before id
    const mountedLayersByType = this._getMountedBottomLayersByType(map, type);
    if (!mountedLayersByType) return;

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

  _getIdToMountOnTypesBottomSync(
    map: MapLibre,
    type: LayersType,
  ): string | undefined {
    const bottomLayersOfMountedType = this._getMountedBottomLayersByType(
      map,
      type,
    );
    if (!bottomLayersOfMountedType) return;
    const currentTypeBottomLayer = bottomLayersOfMountedType.get(type);
    // if there is bottom layer for the current type - return it to mount underneath it
    if (currentTypeBottomLayer?.id) return currentTypeBottomLayer.id;
    // if no layers for current type mounted -
    // search for the closest top type to mount right underneath it

    const firstHigherMountedType = this._typesOrder
      // get all higher types
      .slice(this._typesOrder.indexOf(type) + 1)
      // find closest of them that exists on map
      .find((t) => bottomLayersOfMountedType.has(t));

    // if there's no higher type mounted - return undefined and mount layer on top
    if (!firstHigherMountedType) return;
    // if higher type is mounted, get it's bottom layer's id to mount underneath it
    return bottomLayersOfMountedType.get(firstHigherMountedType)?.id;
  }

  private _getMountedBottomLayersByType(map: MapLibre, type: LayersType) {
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

    const customLayers = allLayers.slice(this._baseMapFirstLayerIdx + 1);

    // Check for the first custom layer
    // return undefined so it wouldn't draw under the basemap
    if (!customLayers.length) return undefined;

    // Create map { type: upper layer with this type }
    const mountedBottomLayersByType = new Map<
      LayersType,
      maplibregl.AnyLayer
    >();
    let n = 0;
    // this loop will come from bottom to top layers
    while (n < customLayers.length) {
      const layer = customLayers[n];
      // set the lowest layer for it's type
      if (!mountedBottomLayersByType.has(layer.type)) {
        mountedBottomLayersByType.set(layer.type, layer);
      }
      n++;
    }
    return mountedBottomLayersByType;
  }

  private _asyncWrap(
    type: LayersType,
    cb: (id: string | undefined) => void,
    syncFunction: (map: MapLibre, type: LayersType) => string | undefined,
  ) {
    const map = this._map;
    if (map === null || this._baseMapFirstLayerIdx === null) {
      this._awaitingTasks.add((map) => {
        cb(syncFunction(map, type));
      });
    } else {
      // Wait all sync tasks
      cb(syncFunction(map, type));
    }
  }
}

export const layersOrderManager = new LayersOrderManager();
