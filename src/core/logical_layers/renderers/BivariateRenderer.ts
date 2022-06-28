import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import {
  LAYER_BIVARIATE_PREFIX,
  SOURCE_BIVARIATE_PREFIX,
} from '~core/logical_layers/constants';
import { layerByOrder } from '~utils/map/layersOrder';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { waitMapEvent } from '~utils/map/waitMapEvent';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { AnyLayer, RasterSource, VectorSource } from 'maplibre-gl';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _layerId?: string;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;

  public constructor({ id }: { id: string }) {
    super();
    this.id = id;
    /* private */
    this._sourceId = SOURCE_BIVARIATE_PREFIX + this.id;
  }

  _generateLayerFromLegend(legend: BivariateLegend): Omit<AnyLayer, 'id'> {
    if (legend.type === 'bivariate') {
      return generateLayerStyleFromBivariateLegend(legend);
    }
    throw new Error(`Unexpected legend type '${legend.type}'`);
  }

  /* https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/#vector-scheme */
  _setTileScheme(rawUrl: string, mapSource: VectorSource | RasterSource) {
    const isTMS = rawUrl.includes('{-y}');
    if (isTMS) {
      mapSource.scheme = 'tms';
    }
  }

  mountBivariateLayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    legend: BivariateLegend | null,
  ) {
    /* Create source */
    const mapSource: VectorSource = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 22,
    };
    // I expect that all servers provide url with same scheme
    this._setTileScheme(layer.source.urls[0], mapSource);
    if (map.getSource(this._sourceId) === undefined) {
      map.addSource(this._sourceId, mapSource);
    }
    /* Create layer */
    if (legend) {
      const layerStyle = this._generateLayerFromLegend(legend);
      const layerId = `${LAYER_BIVARIATE_PREFIX + this.id}`;
      if (map.getLayer(layerId)) {
        return;
      }
      const layer = { ...layerStyle, id: layerId, source: this._sourceId };
      layerByOrder(map).addAboveLayerWithSameType(layer as AnyLayer);
      this._layerId = layer.id;
    } else {
      // We don't known source-layer id
      throw new Error(
        `[GenericLayer ${this.id}] Vector layers must have legend`,
      );
    }
  }

  private _updateMap(
    map: ApplicationMap,
    layerData: LayerTileSource,
    legend: BivariateLegend | null,
  ) {
    if (layerData == null) return;
    this.mountBivariateLayer(map, layerData, legend);
  }

  /* ========== Hooks ========== */
  willSourceUpdate({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
      );
    }
  }

  async willMount({
    map,
    state,
  }: {
    map: ApplicationMap;
    state: LogicalLayerState;
  }) {
    if (state.source) {
      // this case happens after userprofile change resets most of the app
      !map.loaded() && (await waitMapEvent(map, 'load'));
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
      );
    }
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    if (
      this._layerId !== undefined &&
      map.getLayer(this._layerId) !== undefined
    ) {
      map.removeLayer(this._layerId);
    } else {
      console.warn(
        `Can't remove layer with ID: ${this._layerId}. Layer does't exist in map`,
      );
    }

    this._layerId = undefined;

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
    if (this._layerId === undefined || map === null) return;

    if (map.getLayer(this._layerId) !== undefined) {
      map.setLayoutProperty(this._layerId, 'visibility', 'none');
    } else {
      console.warn(
        `Can't hide layer with ID: ${this._layerId}. Layer doesn't exist on the map`,
      );
    }
  }

  willUnhide({ map }: { map: ApplicationMap }) {
    if (this._layerId === undefined || map === null) return;

    if (map.getLayer(this._layerId) !== undefined) {
      map.setLayoutProperty(this._layerId, 'visibility', 'visible');
    } else {
      console.warn(
        `Cannot unhide layer with ID: ${this._layerId}. Layer doesn't exist on the map`,
      );
    }
  }

  willDestroy({ map }: { map: ApplicationMap | null }) {
    if (this._layerId === undefined || map === null) return;

    if (map.getLayer(this._layerId) === undefined) return;

    this.willUnMount({ map });
  }
}
