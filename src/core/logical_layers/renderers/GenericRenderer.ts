import {
  applyLegendConditions,
  mapCSSToMapBoxProperties,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import {
  LAYER_IN_AREA_PREFIX,
  SOURCE_IN_AREA_PREFIX,
} from '~features/layers_in_area/constants';
import { layerTypesOrdered } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { layerByOrder } from '~core/logical_layers';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { replaceUrlWithProxy } from '~utils/axios/replaceUrlWithProxy';
import { mapPopoverRegistry } from '~core/map/popover/globalMapPopoverRegistry';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { mapLibreParentsIds } from '~core/logical_layers/utils/layersOrder/mapLibreParentsIds';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { addZoomFilter, onActiveContributorsClick } from './activeContributorsLayers';
import { styleConfigs } from './stylesConfigs';
import { setTileScheme } from './setTileScheme';
import { GenericRendererPopoverProvider } from './GenericRendererPopoverProvider';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type {
  LayerSpecification,
  GeoJSONSource,
  GeoJSONSourceSpecification,
  RasterSourceSpecification,
  VectorSourceSpecification,
} from 'maplibre-gl';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { LayersType } from '~core/logical_layers/utils/layersOrder/layersOrder';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type {
  LayerGeoJSONSource,
  LayerSource,
  LayerTileSource,
} from '~core/logical_layers/types/source';
import type { LayerStyle } from '../types/style';
import type { IMapPopoverContentProvider } from '~core/map/types';

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class GenericRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  public highestLayerType?: LayersType;
  private _layerIds: Set<string>;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;
  private _tooltipProvider: IMapPopoverContentProvider | null = null;

  private get popoverId(): string {
    return `tooltip-${this._sourceId}`;
  }

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._layerIds = new Set();
    this._sourceId = SOURCE_IN_AREA_PREFIX + this.id;
  }

  _setLayersIds(layers: Omit<LayerSpecification, 'id'>[]): LayerSpecification[] {
    return layers.map((layer, i) => {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
      const mapLayer = { ...layer, id: layerId, source: this._sourceId };
      return mapLayer as LayerSpecification;
    });
  }

  async mountGeoJSONLayer(
    map: ApplicationMap,
    layer: LayerGeoJSONSource,
    legend: LayerLegend | null,
    style: LayerStyle | null,
  ) {
    /* Create source */
    const mapSource: GeoJSONSourceSpecification = {
      type: 'geojson' as const,
      data: layer.source.data,
    };
    const source = map.getSource(this._sourceId) as GeoJSONSource;
    /* Mount or update source */
    if (!source) {
      map.addSource(this._sourceId, mapSource);
    } else {
      source.setData(
        (mapSource.data as GeoJSON.GeoJSON) || {
          type: 'FeatureCollection',
          features: [],
        },
      );
    }

    /* Create layer */

    let layerStyles = Array<LayerSpecification>();

    if (style && style.type in styleConfigs) {
      // New way to describe layers - styles sended separately from legend
      layerStyles = styleConfigs[style.type](style.config);
    } else if (legend && Array.isArray(legend.steps) && legend.steps.length) {
      // Old way - styles guessed from legend if possible
      layerStyles = _generateLayersFromLegend(legend);
    } else {
      // Fallback layer
      layerStyles.push({
        id: 'fallback',
        type: 'fill' as const,
        source: this._sourceId,
        paint: {
          'fill-color': 'pink' as const,
        },
      });
    }

    // Setup ids
    const layers = this._setLayersIds(layerStyles);

    // Add to map in order
    this.highestLayerType = getHighestType(layers);
    layers.forEach((mapLayer) => {
      const layer = map.getLayer(mapLayer.id);
      if (layer) {
        map.removeLayer(layer.id);
      }
      layerByOrder(map).addAboveLayerWithSameType(mapLayer, this.id);
      this._layerIds.add(mapLayer.id);
    });

    // cleanup unused layers
    this._layerIds.forEach((id) => {
      if (!layers.find((layer) => layer.id === id)) {
        if (map.getLayer(id)) {
          map.removeLayer(id);
          this._layerIds.delete(id);
        }
        return;
      }
    });
  }

  mountTileLayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    legend: LayerLegend | null,
  ) {
    /* Create source */
    const mapSource: VectorSourceSpecification | RasterSourceSpecification = {
      type: layer.source.type,
      tiles: layer.source.urls.map((url) => _adaptUrl(url, layer.source.apiKey)),
      tileSize: layer.source.tileSize || 256,
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 24,
    };
    // I expect that all servers provide url with same scheme
    setTileScheme(layer.source.urls[0], mapSource);
    const source = map.getSource(this._sourceId);
    if (source) {
      // TODO: update tile source
    } else {
      map.addSource(this._sourceId, mapSource);
    }
    /* Create layer */
    if (mapSource.type === 'raster') {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      if (map.getLayer(layerId)) return;
      const mapLayer = {
        id: layerId,
        type: 'raster' as const,
        source: this._sourceId,
        minzoom: 0,
        maxzoom: 24,
      };
      layerByOrder(map).addAboveLayerWithSameType(mapLayer, this.id);
      this._layerIds.add(mapLayer.id);
    } else {
      // Vector tiles
      if (legend) {
        const layerStyles = _generateLayersFromLegend(legend);
        const layers = this._setLayersIds(layerStyles);
        const isAllLayersAlreadyAdded = layers.every(
          (layers) => !!map.getLayer(layers.id),
        );
        if (isAllLayersAlreadyAdded) return;
        // !FIXME - Hardcoded filter for layer
        // Must be deleted after LayersDB implemented
        if (this.id === 'activeContributors') {
          addZoomFilter(layers);
        }
        console.assert(
          layers.length !== 0,
          `Zero layers generated for layer "${this.id}". Check legend and layer type`,
        );
        layers.forEach(async (mapLayer) => {
          if (map.getLayer(mapLayer.id)) {
            map.removeLayer(mapLayer.id);
          }
          layerByOrder(map).addAboveLayerWithSameType(mapLayer, this.id);
          this._layerIds.add(mapLayer.id);
        });
      } else {
        // We don't known source-layer id
        throw new Error(`[GenericLayer ${this.id}] Vector layers must have legend`);
      }
    }
  }

  private async _updateMap(
    map: ApplicationMap,
    layerData: LayerSource,
    legend: LayerLegend | null,
    isVisible: boolean,
    style: LayerStyle | null,
  ) {
    if (layerData == null) return;
    await mapLoaded(map);

    if (isGeoJSONLayer(layerData)) {
      this.mountGeoJSONLayer(map, layerData, legend, style);
    }
    // @ts-ignore skip, unsupported
    else if (layerData.source.type === 'maplibre-style-url') {
      const styleUrl = layerData.source.urls?.[0];
      if (styleUrl) {
        const layersToRemount = Array.from(mountedLayersAtom.getState().entries()).filter(
          ([id]) => id !== this.id,
        );
        map.setStyle(styleUrl);
        map.once('styledata', () => {
          mapLibreParentsIds.clear();
          layersOrderManager.init(map, mapLibreParentsIds, layersSettingsAtom);
          layersToRemount.forEach(([, layer]) => {
            layer('disable');
            layer('enable');
          });
        });
      }
    } else {
      this.mountTileLayer(map, layerData, legend);
    }
    if (!isVisible) this.willHide({ map });

    /* Add event listener */
    // !FIXME - Hardcoded filter for layer
    // Must be deleted after LayersDB implemented
    if (this.id === 'activeContributors') {
      if (!this._removeClickListener) {
        const onClick = onActiveContributorsClick(map, this._sourceId);
        this._removeClickListener = registerMapListener(
          'click',
          (e) => (onClick(e), true),
          60,
        );
      }
      return;
    }

    if (legend) {
      const linkProperty = 'linkProperty' in legend ? legend.linkProperty : null;
      if (linkProperty) {
        const handler = (e) => {
          this.onMapClick(map, e, linkProperty);
          return true;
        };
        if (!this._removeClickListener) {
          this._removeClickListener = registerMapListener('click', handler, 60);
        }
      }

      // Add tooltip provider if it's described in legend
      if ('tooltip' in legend && legend.tooltip) {
        const paramName = legend.tooltip.paramName;
        const tooltipType = legend.tooltip.type;
        // we only expect markdown tooltip type ATM
        if (paramName && tooltipType === 'markdown') {
          // Create and register tooltip provider with MapPopover registry
          if (this._tooltipProvider) {
            mapPopoverRegistry.unregister(this.popoverId);
          }
          this._tooltipProvider = new GenericRendererPopoverProvider(
            this._sourceId,
            paramName,
            tooltipType,
          );
          mapPopoverRegistry.register(this.popoverId, this._tooltipProvider);
        }
      } else {
        // Clean up tooltip provider if no longer needed
        if (this._tooltipProvider) {
          mapPopoverRegistry.unregister(this.popoverId);
          this._tooltipProvider = null;
        }
      }
    }
  }

  async onMapClick(
    map: ApplicationMap,
    ev: maplibregl.MapMouseEvent,
    linkProperty: string,
  ) {
    if (!ev || !ev.lngLat) return;
    const thisLayersFeatures = ev.target
      .queryRenderedFeatures(ev.point)
      .filter((f) => f.source === this._sourceId);
    if (thisLayersFeatures.length === 0) return;
    const featureWithLink = thisLayersFeatures.find(
      (feature) => feature.properties?.[linkProperty] !== undefined,
    );
    if (featureWithLink === undefined) return;
    const link = featureWithLink.properties?.[linkProperty];
    window.open(link);
  }

  /* ========== Hooks ========== */

  async willLegendUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      try {
        await this._updateMap(
          map,
          state.source,
          state.legend,
          state.isVisible,
          state.style,
        );
      } catch (e) {
        this.onError(e);
      }
    }
  }

  async willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      try {
        await this._updateMap(
          map,
          state.source,
          state.legend,
          state.isVisible,
          state.style,
        );
      } catch (e) {
        this.onError(e);
      }
    }
  }

  async willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      try {
        await this._updateMap(
          map,
          state.source,
          state.legend,
          state.isVisible,
          state.style,
        );
      } catch (e) {
        this.onError(e);
      }
    }
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    this._removeLayers(map);
    if (this._sourceId) {
      if (map.getSource(this._sourceId) !== undefined) {
        map.removeSource(this._sourceId);
      } else {
        console.warn(
          `Can't remove source with ID: ${this._sourceId}. Source does't exist in map`,
        );
      }
    }
    this._removeClickListener?.();
    this._removeClickListener = null;

    // Clean up tooltip provider
    if (this._tooltipProvider) {
      mapPopoverRegistry.unregister(this.popoverId);
      this._tooltipProvider = null;
    }
  }

  willHide({ map }: { map: ApplicationMap }) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', 'none');
      } else {
        console.warn(`Can't hide layer with ID: ${id}. Layer doesn't exist on the map`);
      }
    });
  }

  willUnhide({ map }: { map: ApplicationMap }) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', 'visible');
      } else {
        console.warn(
          `Cannot unhide layer with ID: ${id}. Layer doesn't exist on the map`,
        );
      }
    });
  }

  willDestroy({ map }: { map: ApplicationMap | null }) {
    // only unmount layers that was mounted
    if (!this._layerIds.size) return;
    if (map === null) return;
    for (const id of this._layerIds) {
      if (!map.getLayer(id)) return;
    }
    this.willUnMount({ map });
  }

  private _removeLayers(map: ApplicationMap) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.removeLayer(id);
      } else {
        console.warn(`Can't remove layer with ID: ${id}. Layer does't exist in map`);
      }
    });
    this._layerIds = new Set();
  }
}

function getHighestType(layers: maplibregl.LayerSpecification[]) {
  let result: LayersType | undefined;
  let index = -1;
  layers.forEach((layer) => {
    const layerIndex = layerTypesOrdered.indexOf(layer.type);
    if (layerIndex > index) {
      result = layer.type;
      index = layerIndex;
    }
  });
  return result;
}

function isGeoJSONLayer(layer: LayerSource): layer is LayerGeoJSONSource {
  return layer.source.type === 'geojson';
}

function _adaptUrl(url: string, apiKey?: string) {
  /** Fix cors in local development */
  if (import.meta.env.DEV) {
    url = replaceUrlWithProxy(url);
  }
  /**
   * Protocol fix
   * request from https to http failed in browser with "mixed content" error
   * solution: cut off protocol part and replace with current page protocol
   */
  url = window.location.protocol + url.replace(/https?:/, '');
  /**
   * Some link templates use values that mapbox/maplibre do not understand
   * solution: convert to equivalents
   */
  url = url
    .replace('{bbox}', '{bbox-epsg-3857}')
    .replace('{proj}', 'EPSG:3857')
    .replace('{width}', '256')
    .replace('{height}', '256')
    .replace('{zoom}', '{z}')
    .replace('{-y}', '{y}');

  // layers that need api key to reach
  if (apiKey) {
    url = url.replace('{apiKey}', apiKey);
  }

  /* Some magic for remove `switch:` */
  const domains = (url.match(/{switch:(.*?)}/) || ['', ''])[1].split(',')[0];
  url = url.replace(/{switch:(.*?)}/, domains);
  return url;
}

function _generateLayersFromLegend(legend: LayerLegend): LayerSpecification[] {
  if (legend.type === 'simple') {
    const layers = legend.steps
      /**
       * Layer filters method generate extra layers for legend steps, it simple and reliably.
       * Find properties diff between steps and put expressions right into property value
       * if tou need more map performance
       * */
      .map((step) =>
        setSourceLayer(
          step,
          applyLegendConditions(step, mapCSSToMapBoxProperties(step.style)),
        ),
      );
    // @ts-expect-error - render is missing
    return layers.flat();
  }
  throw new Error(`Unexpected legend type '${legend.type}'`);
}
