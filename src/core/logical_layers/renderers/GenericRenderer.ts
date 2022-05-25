import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import maplibregl, {
  AnyLayer,
  GeoJSONSourceRaw,
  RasterSource,
  VectorSource,
} from 'maplibre-gl';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import {
  applyLegendConditions,
  mapCSSToMapBoxProperties,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import {
  LAYER_IN_AREA_PREFIX,
  SOURCE_IN_AREA_PREFIX,
} from '~features/layers_in_area/constants';
import {
  addZoomFilter,
  onActiveContributorsClick,
} from './activeContributorsLayers';
import {
  layersOrderManager,
  LayersType,
  layerTypesOrdered,
} from '~core/logical_layers/utils/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { replaceUrlWithProxy } from '../../../../vite.proxy';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import {
  LayerGeoJSONSource,
  LayerSource,
  LayerTileSource,
} from '~core/logical_layers/types/source';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';

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
  private _sourceType?: 'geojson' | 'vector' | 'raster';

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._layerIds = new Set();
    this._sourceId = SOURCE_IN_AREA_PREFIX + this.id;
  }

  _generateLayersFromLegend(legend: LayerLegend): Omit<AnyLayer, 'id'>[] {
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
      return layers.flat();
    }
    throw new Error(`Unexpected legend type '${legend.type}'`);
  }

  _setLayersIds(layers: Omit<AnyLayer, 'id'>[]): AnyLayer[] {
    return layers.map((layer, i) => {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}-${i}`;
      const mapLayer = { ...layer, id: layerId, source: this._sourceId };
      return mapLayer as AnyLayer;
    });
  }

  _adaptUrl(url: string) {
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
    /* Some magic for remove `switch:` */
    const domains = (url.match(/{switch:(.*?)}/) || ['', ''])[1].split(',')[0];
    url = url.replace(/{switch:(.*?)}/, domains);
    return url;
  }
  /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
  _setTileScheme(rawUrl: string, mapSource: VectorSource | RasterSource) {
    const isTMS = rawUrl.includes('{-y}');
    if (isTMS) {
      mapSource.scheme = 'tms';
    }
  }

  isGeoJSONLayer = (layer: LayerSource): layer is LayerGeoJSONSource =>
    layer.source.type === 'geojson';

  onMapClick(
    map: ApplicationMap,
    ev: maplibregl.MapMouseEvent & maplibregl.EventData,
    linkProperty: string,
  ) {
    if (!ev || !ev.lngLat) return;
    const thisLayersFeatures = ev.target
      .queryRenderedFeatures(ev.point)
      .filter((f) => f.source.includes(this._sourceId));
    if (thisLayersFeatures.length === 0) return;
    const featureWithLink = thisLayersFeatures.find(
      (feature) => feature.properties?.[linkProperty] !== undefined,
    );
    if (featureWithLink === undefined) return;
    const link = featureWithLink.properties?.[linkProperty];
    window.open(link);
  }

  /* ========== Hooks ========== */

  willLegendUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    this._mountLayers(map, state.legend, state.isVisible);
    this._addClickListeners(map, state.legend);
  }

  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      this._createAndUpdateSource(
        map,
        state.source,
        state.legend,
        state.isVisible,
      );
    }
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      this._createAndUpdateSource(
        map,
        state.source,
        state.legend,
        state.isVisible,
      );
      this._mountLayers(map, state.legend, state.isVisible);
    }
    this._addClickListeners(map, state.legend);
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
  }

  willHide({ map }: { map: ApplicationMap }) {
    this._layerIds.forEach((id) => {
      if (map.getLayer(id) !== undefined) {
        map.setLayoutProperty(id, 'visibility', 'none');
      } else {
        console.warn(
          `Can't hide layer with ID: ${id}. Layer doesn't exist on the map`,
        );
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
        console.warn(
          `Can't remove layer with ID: ${id}. Layer does't exist in map`,
        );
      }
    });
    this._layerIds = new Set();
  }

  private _createAndUpdateSource(
    map: maplibregl.Map,
    layerSource: LayerSource,
    legend: LayerLegend | null,
    isVisible: boolean,
  ) {
    const sourceWasUndefined = this._sourceType === undefined;
    if (sourceWasUndefined) this._sourceType = layerSource.source.type;

    if (layerSource.source.type === 'geojson') {
      // adding or updating GeoJSON Source
      const mapSource: GeoJSONSourceRaw = {
        type: 'geojson' as const,
        data: layerSource.source.data,
      };
      const existingSource = map.getSource(
        this._sourceId,
      ) as maplibregl.GeoJSONSource;
      /* Mount or update source */
      if (!existingSource) {
        map.addSource(this._sourceId, mapSource);
      } else {
        existingSource.setData(
          mapSource.data || {
            type: 'FeatureCollection',
            features: [],
          },
        );
      }
    } else {
      // adding Tile Source
      const mapSource: VectorSource | RasterSource = {
        type: layerSource.source.type,
        tiles: layerSource.source.urls.map((url) => this._adaptUrl(url)),
        tileSize: layerSource.source.tileSize || 256,
        minzoom: ('minZoom' in layerSource && layerSource.minZoom) || 0,
        maxzoom: ('maxZoom' in layerSource && layerSource.maxZoom) || 22,
      };
      // I expect that all servers provide url with same scheme
      this._setTileScheme(layerSource.source.urls[0], mapSource);
      const source = map.getSource(this._sourceId);
      if (source) {
        // TODO: update tile source
      } else {
        map.addSource(this._sourceId, mapSource);
      }
    }

    if (sourceWasUndefined) {
      this._mountLayers(map, legend, isVisible);
    }
  }

  private _mountLayers(
    map: maplibregl.Map,
    legend: LayerLegend | null,
    isVisible = true,
  ) {
    // Mount GEOJson layer
    if (this._sourceType === 'geojson') {
      if (legend && legend.steps.length) {
        const layerStyles = this._generateLayersFromLegend(legend);
        const layers = this._setLayersIds(layerStyles);
        this.highestLayerType = getHighestType(layers);
        layers.forEach(async (mapLayer) => {
          const layer = map.getLayer(mapLayer.id);
          if (layer) {
            map.removeLayer(layer.id);
          }

          layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
            map.addLayer(mapLayer, beforeId);
            this._layerIds.add(mapLayer.id);
          });
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
      } else {
        // Fallback layer
        const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
        if (map.getLayer(layerId)) return;
        const mapLayer = {
          id: layerId,
          source: this._sourceId,
          type: 'fill' as const,
          paint: {
            'fill-color': 'pink' as const,
          },
        };

        layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
          map.addLayer(mapLayer, beforeId);
          this._layerIds.add(mapLayer.id);
        });
        // cleanup unused layers
        this._layerIds.forEach((id) => {
          if (id !== layerId) {
            map.removeLayer(id);
            this._layerIds.delete(id);
            return;
          }
        });
      }
    }
    // Mount raster layer
    else if (this._sourceType === 'raster') {
      const layerId = `${LAYER_IN_AREA_PREFIX + this.id}`;
      if (map.getLayer(layerId)) return;
      const mapLayer = {
        id: layerId,
        type: 'raster' as const,
        source: this._sourceId,
        minzoom: 0,
        maxzoom: 22,
      };
      layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
        map.addLayer(mapLayer, beforeId);
        this._layerIds.add(layerId);
      });
    }
    // Mount vector tiles layer
    else if (this._sourceType === 'vector' && legend) {
      const layerStyles = this._generateLayersFromLegend(legend);
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
        layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
          map.addLayer(mapLayer as AnyLayer, beforeId);
          this._layerIds.add(mapLayer.id);
        });
      });
    } else if (this._sourceType === 'vector' && !legend) {
      throw new Error(
        `[GenericLayer ${this.id}] Vector layers must have legend`,
      );
    }

    if (!isVisible) this.willHide({ map });
  }

  private _addClickListeners(map: maplibregl.Map, legend: LayerLegend | null) {
    if (this._removeClickListener) return;
    // !FIXME - Hardcoded filter for layer
    // Must be deleted after LayersDB implemented
    if (this.id === 'activeContributors') {
      const onClick = onActiveContributorsClick(map, this._sourceId);
      this._removeClickListener = registerMapListener(
        'click',
        (e) => (onClick(e), true),
        60,
      );
      return;
    }
    if (legend) {
      const linkProperty =
        'linkProperty' in legend ? legend.linkProperty : null;
      if (linkProperty) {
        const handler = (e) => {
          this.onMapClick(map, e, linkProperty);
          return true;
        };
        this._removeClickListener = registerMapListener('click', handler, 60);
        return;
      }

      // Add tooltip if it's described in legend
      if ('tooltip' in legend) {
        const paramName = legend.tooltip?.paramName;
        const tooltipType = legend.tooltip?.type;
        // we only expect markdown tooltip type ATM
        if (!paramName || tooltipType !== 'markdown') return;

        this._removeClickListener = registerMapListener(
          'click',
          (ev) => {
            if (!ev || !ev.lngLat) return true;
            const thisLayersFeatures = ev.target
              .queryRenderedFeatures(ev.point)
              .filter((f) => f.source.includes(this._sourceId));
            const featureProperties = thisLayersFeatures.find(
              (feature) => feature.properties?.[paramName],
            )?.properties;
            if (!featureProperties) return true;
            currentTooltipAtom.setCurrentTooltip.dispatch({
              popup: featureProperties[paramName],
              position: {
                x: ev.originalEvent.clientX,
                y: ev.originalEvent.clientY,
              },
              onOuterClick(e, close) {
                close();
              },
            });
            // Don't allow lower clicks to run - for example ignore active contributors click afterwards
            return false;
          },
          // lower number would mean higher priority for layer types that drawn higher
          50 -
            (this.highestLayerType
              ? layerTypesOrdered.indexOf(this.highestLayerType)
              : 0),
        );
      }
    }
  }
}

function getHighestType(layers: maplibregl.AnyLayer[]) {
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
