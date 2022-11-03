import throttle from 'lodash/throttle';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { generateLayerStyleFromBivariateLegend } from '~utils/bivariate/bivariateColorThemeUtils';
import {
  LAYER_BIVARIATE_PREFIX,
  SOURCE_BIVARIATE_PREFIX,
} from '~core/logical_layers/constants';
import { layerByOrder } from '~utils/map/layersOrder';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { currentTooltipAtom } from '~core/shared_state/currentTooltip';
import { MapHexTooltip, popupContentRoot } from '~components/MapHexTooltip/MapHexTooltip';
import { invertClusters } from '~utils/bivariate';
import type { MapListener } from '~core/shared_state/mapListeners';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { AnyLayer, RasterSource, VectorSource } from 'maplibre-gl';
import type {
  BivariateLegend,
  BivariateLegendStep,
} from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../utils/layersOrder/layersOrder';

type FillColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const HOVER_HEXAGON_BORDER = 'rgba(5, 22, 38, 0.4)';
const ACTIVE_HEXAGON_BORDER = 'rgb(5, 22, 38)';

const HEX_SELECTED_LAYER_ID = 'hex-selected-layer';
const HEX_SELECTED_SOURCE_ID = 'hex-selected-source';
const HEX_HOVER_SOURCE_ID = 'hex-hover-source';
const HEX_HOVER_LAYER_ID = 'hex-hover-layer';
/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  private _layerId?: string;
  private _sourceId: string;
  private _removeClickListener: null | (() => void) = null;
  private _removeMouseMoveListener: null | (() => void) = null;
  private _layersOrderManager?: LayersOrderManager;

  public constructor({
    id,
    layersOrderManager,
  }: {
    id: string;
    layersOrderManager?: LayersOrderManager;
  }) {
    super();
    this.id = id;
    this._layersOrderManager = layersOrderManager;
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

  async mountBivariateLayer(
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

    await mapLoaded(map);
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
      layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
        layer as AnyLayer,
      );
      this._layerId = layer.id;
    } else {
      // We don't known source-layer id
      throw new Error(`[GenericLayer ${this.id}] Vector layers must have legend`);
    }
  }

  convertFillColorToRGBA = (fillColor: FillColor, withTransparency = true): string =>
    `rgba(${fillColor.r * 255 * 2},${fillColor.g * 255 * 2},${fillColor.b * 255 * 2}${
      withTransparency ? ',' + fillColor.a : ''
    })`;

  private _updateMap(
    map: ApplicationMap,
    layerData: LayerTileSource,
    legend: BivariateLegend | null,
    isVisible: boolean,
  ) {
    if (layerData == null) return;
    this.mountBivariateLayer(map, layerData, legend);

    const clickHandler = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));
      if (!features.length || !legend || !features[0].geometry) return true;

      const feature = features[0];
      const geometry = feature.geometry;
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];
      if (!fillColor) return true;

      const rgba = this.convertFillColorToRGBA(fillColor);
      const cells: BivariateLegendStep[] = invertClusters(legend.steps, 'label');
      const cellIndex = cells.findIndex((i) => i.color === rgba);

      currentTooltipAtom.setCurrentTooltip.dispatch({
        popup: (
          <MapHexTooltip
            cellLabel={cells[cellIndex].label}
            cellIndex={cellIndex}
            axis={legend.axis}
            hexagonColor={rgba}
          />
        ),
        popupClasses: { popupContent: popupContentRoot },
        position: {
          x: ev.originalEvent.clientX,
          y: ev.originalEvent.clientY,
        },
        onClose(_e, close) {
          close();
          cleanSelection();
        },
        onOuterClick(_e, close) {
          close();
          cleanSelection();
        },
      });

      if (!map.getSource(HEX_SELECTED_SOURCE_ID)) {
        map.addSource(HEX_SELECTED_SOURCE_ID, {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry,
            properties: {},
          },
        });

        map.addLayer({
          id: HEX_SELECTED_LAYER_ID,
          type: 'line',
          source: HEX_SELECTED_SOURCE_ID,
          layout: {},
          paint: {
            'line-color': ACTIVE_HEXAGON_BORDER,
            'line-width': 1,
          },
        });
      } else {
        const source = map.getSource(HEX_SELECTED_SOURCE_ID) as mapboxgl.GeoJSONSource;
        source.setData({
          type: 'Feature',
          geometry,
          properties: {},
        });
      }

      return true;
    };

    const mousemoveHandler = throttle(
      (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
        const features = ev.target.queryRenderedFeatures(ev.point);
        if (
          !features.length ||
          !features[0].geometry ||
          !features[0]?.source.includes(this._sourceId) // we want to process hover only if top layer is bivariate
        )
          return true;
        const feature = features[0];
        const geometry = feature.geometry;

        if (!map.getSource(HEX_HOVER_SOURCE_ID)) {
          map.addSource(HEX_HOVER_SOURCE_ID, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry,
              properties: {},
            },
          });
          map.addLayer({
            id: HEX_HOVER_LAYER_ID,
            type: 'line',
            source: HEX_HOVER_SOURCE_ID,
            layout: {},
            paint: {
              'line-color': HOVER_HEXAGON_BORDER,
              'line-width': 1,
            },
          });
        } else {
          const source = map.getSource(HEX_HOVER_SOURCE_ID) as mapboxgl.GeoJSONSource;
          source.setData({
            type: 'Feature',
            geometry,
            properties: {},
          });
        }

        return true;
      },
      100,
    ) as MapListener;

    map.on('zoom', () => {
      cleanHover();
      cleanSelection();
    });

    const cleanHover = () => {
      if (map.getSource(HEX_HOVER_SOURCE_ID)) {
        map.removeLayer(HEX_HOVER_LAYER_ID);
        map.removeSource(HEX_HOVER_SOURCE_ID);
      }
    };

    const cleanSelection = () => {
      if (map.getSource(HEX_SELECTED_SOURCE_ID)) {
        map.removeLayer(HEX_SELECTED_LAYER_ID);
        map.removeSource(HEX_SELECTED_SOURCE_ID);
      }
    };

    if (this._removeMouseMoveListener) {
      this._removeMouseMoveListener();
      this._removeMouseMoveListener = null;
    }
    this._removeMouseMoveListener = registerMapListener(
      'mousemove',
      mousemoveHandler,
      60,
    );
    if (this._removeClickListener) {
      this._removeClickListener();
      this._removeClickListener = null;
    }
    this._removeClickListener = registerMapListener('click', clickHandler, 60);

    if (!isVisible) this.willHide({ map });
  }

  /* ========== Hooks ========== */
  willSourceUpdate({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
        state.isVisible,
      );
    }
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
        state.isVisible,
      );
    }
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    if (this._layerId !== undefined && map.getLayer(this._layerId) !== undefined) {
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
    this._removeMouseMoveListener?.();
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
