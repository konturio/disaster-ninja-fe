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
import { LAYER_IN_AREA_PREFIX, SOURCE_IN_AREA_PREFIX } from '../constants';
import {
  addZoomFilter,
  onActiveContributorsClick,
} from './activeContributorsLayers';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { replaceUrlWithProxy } from '../../../../vite.proxy';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import {
  LayerGeoJSONSource,
  LayerSource,
  LayerTileSource,
} from '~core/logical_layers/types/source';
import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class GenericRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _layerIds: Set<string>;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;

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
    if (legend.type === 'bivariate' && 'axis' in legend) {
      return [generateLayerStyleFromBivariateLegend(legend)];
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

  async mountGeoJSONLayer(
    map: ApplicationMap,
    layer: LayerGeoJSONSource,
    legend: LayerLegend | null,
  ) {
    /* Create source */
    const mapSource: GeoJSONSourceRaw = {
      type: 'geojson' as const,
      data: layer.source.data,
    };
    const source = map.getSource(this._sourceId) as maplibregl.GeoJSONSource;
    /* Mount or update source */
    if (!source) {
      map.addSource(this._sourceId, mapSource);
    } else {
      source.setData(
        mapSource.data || {
          type: 'FeatureCollection',
          features: [],
        },
      );
    }
    /* Create layer */
    if (legend) {
      const layerStyles = this._generateLayersFromLegend(legend);
      const layers = this._setLayersIds(layerStyles);
      layers.forEach(async (mapLayer) => {
        const layer = map.getLayer(mapLayer.id);
        if (layer) {
          map.removeLayer(layer.id);
        }
        /* Look at class comment */
        requestAnimationFrame(() => {
          layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
            map.addLayer(mapLayer, beforeId);
            this._layerIds.add(mapLayer.id);
          });
        });
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
      /* Look at class comment */
      requestAnimationFrame(() => {
        layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
          map.addLayer(mapLayer, beforeId);
          this._layerIds.add(mapLayer.id);
        });
      });
    }
    // TODO: Remove unused in new legend layers
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
    url =
      window.location.protocol + url.replace('https:', '').replace('http:', '');
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

  mountTileLayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    legend: LayerLegend | null,
  ) {
    /* Create source */
    const mapSource: VectorSource | RasterSource = {
      type: layer.source.type,
      tiles: layer.source.urls.map((url) => this._adaptUrl(url)),
      tileSize: layer.source.tileSize || 256,
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 22,
    };
    // I expect that all servers provide url with same scheme
    this._setTileScheme(layer.source.urls[0], mapSource);
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
        maxzoom: 22,
      };
      /* Look at class comment */
      requestAnimationFrame(() => {
        layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
          map.addLayer(mapLayer, beforeId);
          this._layerIds.add(layerId);
        });
      });
    } else {
      // Vector tiles
      if (legend) {
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
          /* Look at class comment */
          requestAnimationFrame(() => {
            layersOrderManager.getBeforeIdByType(mapLayer.type, (beforeId) => {
              map.addLayer(mapLayer as AnyLayer, beforeId);
              this._layerIds.add(mapLayer.id);
            });
          });
        });
      } else {
        // We don't known source-layer id
        throw new Error(
          `[GenericLayer ${this.id}] Vector layers must have legend`,
        );
      }
    }
  }

  isGeoJSONLayer = (layer: LayerSource): layer is LayerGeoJSONSource =>
    layer.source.type === 'geojson';

  _updateMap(
    map: ApplicationMap,
    layerData: LayerSource,
    legend: LayerLegend | null,
  ) {
    if (layerData == null) return;
    if (this.isGeoJSONLayer(layerData)) {
      this.mountGeoJSONLayer(map, layerData, legend);
    } else {
      this.mountTileLayer(map, layerData, legend);
    }
    /* Add event listener */
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
      }
    }
  }

  async onMapClick(
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
    if (state.source) {
      this._updateMap(map, state.source, state.legend);
    }
  }

  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      this._updateMap(map, state.source, state.legend);
    }
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      this._updateMap(map, state.source, state.legend);
    }
  }

  willUnMount({ map }: { map: ApplicationMap }) {
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
}
