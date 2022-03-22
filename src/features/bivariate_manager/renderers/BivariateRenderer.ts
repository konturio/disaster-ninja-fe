import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import maplibregl, { AnyLayer, RasterSource, VectorSource } from 'maplibre-gl';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import {
  applyLegendConditions,
  mapCSSToMapBoxProperties,
  setSourceLayer,
} from '~utils/map/mapCSSToMapBoxPropertiesConverter';
import { LAYER_BIVARIATE_PREFIX, SOURCE_BIVARIATE_PREFIX } from '../constants';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { replaceUrlWithProxy } from '../../../../vite.proxy';
import { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import {
  LayerSource,
  LayerTileSource,
} from '~core/logical_layers/types/source';
import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _layerIds: Set<string>;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._layerIds = new Set();
    this._sourceId = LAYER_BIVARIATE_PREFIX + this.id;
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
      const layerId = `${SOURCE_BIVARIATE_PREFIX + this.id}-${i}`;
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
    url = window.location.protocol + url.replace('/https?:/', '');
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

    // Vector tiles
    if (legend) {
      const layerStyles = this._generateLayersFromLegend(legend);
      const layers = this._setLayersIds(layerStyles);
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

  _updateMap(
    map: ApplicationMap,
    layerData: LayerSource,
    legend: LayerLegend | null,
  ) {
    if (layerData == null) return;
    this.mountTileLayer(map, layerData as LayerTileSource, legend);
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
