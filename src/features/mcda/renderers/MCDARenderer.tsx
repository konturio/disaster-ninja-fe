import throttle from 'lodash-es/throttle';
import sumBy from 'lodash-es/sumBy';
import { Popup as MapPopup } from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { LAYER_BIVARIATE_PREFIX } from '~core/logical_layers/constants';
import { layerByOrder } from '~core/logical_layers';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { bivariateHexagonPopupContentRoot } from '~components/MapHexTooltip/MapHexTooltip';
import {
  ACTIVE_HEXAGON_BORDER,
  BivariateRenderer,
  getH3GeoByLatLng,
  HEX_HOVER_LAYER_ID,
  HEX_HOVER_SOURCE_ID,
  HEX_SELECTED_LAYER_ID,
  HEX_SELECTED_SOURCE_ID,
  HOVER_HEXAGON_BORDER,
  isFillColorEmpty,
} from '~core/logical_layers/renderers/BivariateRenderer';
import { PopupMCDA } from '../components/PopupMCDA';
import { calculateLayerPipeline, inViewCalculations } from '../calculations';
import type { MCDAConfig, PopupMCDAProps } from '../types';
import type { FillColor } from '~core/logical_layers/renderers/BivariateRenderer';
import type { AnyLayer, VectorSource } from 'maplibre-gl';
import type { MapListener } from '~core/shared_state/mapListeners';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../../../core/logical_layers/utils/layersOrder/layersOrder';
import type { BivariateLayerStyle } from '~utils/bivariate/bivariateColorThemeUtils';

export class MCDARenderer extends BivariateRenderer {
  private _layerStyle: BivariateLayerStyle;
  private _json: MCDAConfig;

  public constructor({
    id,
    layersOrderManager,
    layerStyle,
    json,
  }: {
    id: string;
    layersOrderManager?: LayersOrderManager;
    layerStyle: BivariateLayerStyle;
    json: MCDAConfig;
  }) {
    super({ id, layersOrderManager });
    this._layerStyle = layerStyle;
    this._json = json;
  }

  async mountMCDALayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    _legend: BivariateLegend | null,
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

    // here is the only change in the method, we use layerStyle instead of generation it from the legend
    const layerStyle = this._layerStyle;
    const layerId = `${LAYER_BIVARIATE_PREFIX + this.id}`;
    if (map.getLayer(layerId)) {
      return;
    }
    const layerRes = { ...layerStyle, id: layerId, source: this._sourceId };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerRes as AnyLayer,
      this.id,
    );
    this._layerId = layerId;
  }

  protected _updateMap(
    map: ApplicationMap,
    layerData: LayerTileSource,
    legend: BivariateLegend | null,
    isVisible: boolean,
  ) {
    if (layerData == null) return;
    this.mountMCDALayer(map, layerData, legend);

    const clickHandler = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));
      if (!features.length || !features[0].geometry) return true;

      const feature = features[0];
      const geometry = getH3GeoByLatLng(ev.lngLat, map.getZoom());
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];

      if (!fillColor || isFillColorEmpty(fillColor) || !feature.properties) return true;

      const popupNode = document.createElement('div');
      const calculateLayer = calculateLayerPipeline(
        inViewCalculations,
        ({ num, den }) => ({
          num: feature.properties?.[num],
          den: feature.properties?.[den],
        }),
      );

      const normalized = this._json.layers.reduce<PopupMCDAProps['normalized']>(
        (acc, layer) => {
          const [num, den] = layer.axis;
          const value = feature.properties?.[num] / feature.properties?.[den];
          acc[`${num}-${den}`] = { val: value, norm: calculateLayer(layer) };
          return acc;
        },
        {},
      );
      const sumNormalized = sumBy(Object.values(normalized), 'norm');
      const coeffsSum = sumBy(this._json.layers, 'coefficient');
      const resultMCDA = sumNormalized / coeffsSum;

      createRoot(popupNode).render(
        PopupMCDA({ json: this._json, normalized, resultMCDA }),
      );

      this.cleanPopup();
      this._popup = new MapPopup({
        closeOnClick: true,
        className: bivariateHexagonPopupContentRoot,
        maxWidth: 'none',
        focusAfterOpen: false,
        offset: 15,
      })
        .setLngLat(ev.lngLat)
        .setDOMContent(popupNode)
        .addTo(map);

      this._popup.once('close', () => {
        this.cleanSelection(map);
      });

      this.cleanHover(map);

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
        const geometry = getH3GeoByLatLng(ev.lngLat, map.getZoom());
        const fillColor: FillColor = feature.layer.paint?.['fill-color'];
        if (!fillColor || isFillColorEmpty(fillColor)) return true;

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

    map.on('zoom', this.onMapZoom);

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
}
