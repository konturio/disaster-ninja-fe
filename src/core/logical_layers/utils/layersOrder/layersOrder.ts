import type { LayersSettingsAtomType } from '../../atoms/layersSettings';
import type { AsyncState } from '~core/logical_layers/types/asyncState';
import type { LayerSettings } from '~core/logical_layers/types/settings';
import type { Unsubscribe } from '@reatom/core-v2';
import type { Map as MapLibre } from 'maplibre-gl';

export type LayerCategory = LayerSettings['category'];
export const layerCategoriesOrdered: LayerCategory[] = ['base', 'overlay', undefined];

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
  private _layersSettings: Map<string, AsyncState<LayerSettings, Error>> | null = null;
  private _layersParentsIds: Map<string, string> | null = null;
  private _unsubscribe: Unsubscribe[] = [];
  private _typesOrder: LayersType[] = [...layerTypesOrdered];

  private _awaitingTasks = new Set<(map: MapLibre) => void>();

  init(
    map: MapLibre,
    mapLibreParentsIds: Map<string, string>,
    layersSettingsAtom: LayersSettingsAtomType,
  ) {
    this._map = map;
    this._unsubscribe.push(
      layersSettingsAtom.subscribe(
        (layersSetting) => (this._layersSettings = layersSetting),
      ),
    );
    this._layersParentsIds = mapLibreParentsIds;

    this._baseMapFirstLayerIdx = (map.getStyle().layers ?? []).length - 1;
    this._awaitingTasks.forEach((task) => {
      this._awaitingTasks.delete(task);
      task(map);
    });
  }

  destroy() {
    this._unsubscribe.forEach((fn) => fn());
  }

  getIdToMountOnTypesTop(
    type: LayersType,
    id: string,
    cb: (id: string | undefined) => void,
  ): void {
    this._asyncWrap(type, id, cb, this._getIdToMountOnTypesTopSync.bind(this));
  }

  getIdToMountOnTypesBottom(
    type: LayersType,
    id: string,
    cb: (id: string | undefined) => void,
  ) {
    this._asyncWrap(type, id, cb, this._getIdToMountOnTypesBottomSync.bind(this));
  }

  private _getIdToMountOnTypesTopSync(
    map: MapLibre,
    type: LayersType,
    id: string,
  ): string | undefined {
    const orderedLayers = this._getMountedOrderedLayers(map);
    if (!orderedLayers?.size) return;

    const mountedLayersOfGivenType = orderedLayers.get(type);

    const givenLayerParentKey = this._layersParentsIds?.get(id);
    const givenLayerSettings = this._layersSettings?.get(givenLayerParentKey || '')?.data;
    if (!givenLayerSettings) {
      console.warn('settings were not found for layer ', type, id);
      return;
    }
    const givenCategory = givenLayerSettings.category;
    // since layers are ordered .find method will return first layer to mount underneath
    const higherLayerOfGivenType = mountedLayersOfGivenType?.find((searchingLayer) => {
      // for 'base' category return first layer that's not base (overlay and no category)
      if (givenCategory === 'base') return searchingLayer.category !== 'base';
      // for overlay return only layers with no category
      if (givenCategory === 'overlay') return searchingLayer.category === undefined;
    });

    if (givenCategory && higherLayerOfGivenType) {
      return higherLayerOfGivenType.layer.id;
    }

    if (!higherLayerOfGivenType || !givenCategory) {
      const higherMountedType = this._typesOrder
        // get all higher types
        .slice(this._typesOrder.indexOf(type) + 1)
        // find closest of them that exists on map
        .find((higherType) => orderedLayers.get(higherType)?.length);

      // Mount on top of the map
      if (!higherMountedType) return undefined;
      const higherMountedLayer = orderedLayers.get(higherMountedType)?.[0].layer.id;
      return higherMountedLayer;
    }
  }

  private _getIdToMountOnTypesBottomSync(
    map: MapLibre,
    type: LayersType,
    id: string,
  ): string | undefined {
    const orderedLayers = this._getMountedOrderedLayers(map);
    if (!orderedLayers?.size) return;
    const mountedLayersOfGivenType = orderedLayers.get(type);
    const givenLayerParentKey = this._layersParentsIds?.get(id);
    const givenLayerSettings = this._layersSettings?.get(givenLayerParentKey || '')?.data;
    if (!givenLayerSettings) {
      console.warn('settings were not found for layer ', type, id);
      return;
    }
    const givenCategory = givenLayerSettings.category;

    const firstLayerOfNextCategory = (() => {
      if (givenCategory === 'base') return mountedLayersOfGivenType?.[0];

      if (givenCategory === 'overlay')
        return mountedLayersOfGivenType?.find(
          (searchingLayer) =>
            searchingLayer.category === 'overlay' ||
            searchingLayer.category === undefined,
        );

      if (givenCategory === undefined)
        return mountedLayersOfGivenType?.find(
          (searchingLayer) => searchingLayer.category === undefined,
        );
    })();

    if (firstLayerOfNextCategory) return firstLayerOfNextCategory.layer.id;

    if (!mountedLayersOfGivenType?.length || !firstLayerOfNextCategory) {
      const higherMountedType = this._typesOrder
        // get all higher types
        .slice(this._typesOrder.indexOf(type) + 1)
        // find closest of them that exists on map
        .find((higherType) => orderedLayers.get(higherType)?.length);

      // Mount on top of the map
      if (!higherMountedType) return undefined;
      const higherMountedLayer = orderedLayers.get(higherMountedType)?.[0].layer.id;
      return higherMountedLayer;
    }
  }

  private _getMountedOrderedLayers(map: MapLibre) {
    if (this._baseMapFirstLayerIdx === null) return;
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

    const mountedOrderedLayers = new Map<
      LayersType,
      { layer: maplibregl.LayerSpecification; category?: LayerCategory }[]
    >();

    // this loop will come from bottom to top layers (from backgrounds and rasters to lines and symbols)
    customLayers.forEach((layer) => {
      const layerParentId = this._layersParentsIds?.get(layer.id);
      if (!layerParentId) return console.warn('id was not found for', layer.id, layer);
      const orderedLayersUnderSameType = mountedOrderedLayers.get(layer.type) || [];
      orderedLayersUnderSameType.push({
        layer: layer,
        category: this._layersSettings?.get(layerParentId)?.data?.category,
      });
      mountedOrderedLayers.set(layer.type, orderedLayersUnderSameType);
    });

    return mountedOrderedLayers;
  }

  private _asyncWrap(
    type: LayersType,
    id: string,
    cb: (id: string | undefined) => void,
    syncFunction: (map: MapLibre, type: LayersType, id: string) => string | undefined,
  ) {
    const map = this._map;
    if (map === null || this._baseMapFirstLayerIdx === null) {
      this._awaitingTasks.add((map) => {
        cb(syncFunction(map, type, id));
      });
    } else {
      // Wait all sync tasks
      cb(syncFunction(map, type, id));
    }
  }
}

export const layersOrderManager = new LayersOrderManager();
