import throttle from 'lodash/throttle';
import isNil from 'lodash/isNil';
import { h3ToGeoBoundary, geoToH3 } from 'h3-js';
import { Popup as MapPopup } from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
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
import {
  bivariateHexagonPopupContentRoot,
  MapHexTooltip,
} from '~components/MapHexTooltip/MapHexTooltip';
import { invertClusters } from '~utils/bivariate';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import type {
  AnyLayer,
  LngLat,
  RasterSource,
  VectorSource,
  MapBoxZoomEvent,
} from 'maplibre-gl';
import type { MapListener } from '~core/shared_state/mapListeners';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type {
  BivariateLegend,
  BivariateLegendStep,
} from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../utils/layersOrder/layersOrder';
import type { GeoJsonProperties } from 'geojson';

type FillColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const MAX_BIVARIATE_GENERATED_RESOLUTION = 8; // keep in sync with backend

const HOVER_HEXAGON_BORDER = 'rgba(5, 22, 38, 0.4)';
const ACTIVE_HEXAGON_BORDER = 'rgb(5, 22, 38)';

const HEX_SELECTED_LAYER_ID = 'hex-selected-layer';
const HEX_SELECTED_SOURCE_ID = 'hex-selected-source';
const HEX_HOVER_SOURCE_ID = 'hex-hover-source';
const HEX_HOVER_LAYER_ID = 'hex-hover-layer';

const isFillColorEmpty = (fillColor: FillColor): boolean =>
  fillColor.a === 0 && fillColor.r === 0 && fillColor.g === 0 && fillColor.b === 0;

const convertFillColorToRGBA = (fillColor: FillColor, withTransparency = true): string =>
  `rgba(${fillColor.r * 255 * 2},${fillColor.g * 255 * 2},${fillColor.b * 255 * 2}${
    withTransparency ? ',' + fillColor.a : ''
  })`;

const getH3GeoByLatLng = (lngLat: LngLat, resolution: number): GeoJSON.Geometry => {
  const h3 = geoToH3(
    lngLat.lat,
    lngLat.lng,
    Math.min(resolution, MAX_BIVARIATE_GENERATED_RESOLUTION),
  );
  const h3Boundary = h3ToGeoBoundary(h3, true);
  fixTransmeridianLoop(h3Boundary);

  return {
    type: 'Polygon',
    coordinates: [h3Boundary],
  };
};

// https://observablehq.com/@nrabinowitz/mapbox-utils
function fixTransmeridianLoop(loop: number[][]) {
  let isTransmeridian = false;
  for (let i = 0; i < loop.length; i++) {
    // check for arcs > 180 degrees longitude, flagging as transmeridian
    if (Math.abs(loop[0][0] - loop[(i + 1) % loop.length][0]) > 180) {
      isTransmeridian = true;
      break;
    }
  }
  if (isTransmeridian) {
    loop.forEach(fixTransmeridianCoord);
  }
}
function fixTransmeridianCoord(coord: number[]) {
  const lng = coord[0];
  coord[0] = lng < 0 ? lng + 360 : lng;
}

const calcValueByNumeratorDenominator = (
  cellValues: Exclude<GeoJsonProperties, null>,
  numerator: string,
  denominator: string,
): string | undefined => {
  const numeratorValue = cellValues[numerator];
  const denominatorValue = cellValues[denominator];

  if (isNil(numeratorValue) || isNil(denominatorValue)) return '0.00';
  if (denominatorValue === 0) return undefined;

  return (numeratorValue / denominatorValue).toFixed(2);
};
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
  private _popup?: MapPopup | null;

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
      const geometry = getH3GeoByLatLng(ev.lngLat, map.getZoom());
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];

      if (!fillColor || isFillColorEmpty(fillColor) || !feature.properties) return true;

      const showValues = featureFlagsAtom.getState()[FeatureFlag.BIVARIATE_MANAGER];
      const [xNumerator, xDenominator] = legend.axis.x.quotient;
      const [yNumerator, yDenominator] = legend.axis.y.quotient;
      const xValue = calcValueByNumeratorDenominator(
        feature.properties,
        xNumerator,
        xDenominator,
      );
      const yValue = calcValueByNumeratorDenominator(
        feature.properties,
        yNumerator,
        yDenominator,
      );

      if (!xValue || !yValue) return true;

      const rgba = convertFillColorToRGBA(fillColor);
      const cells: BivariateLegendStep[] = invertClusters(legend.steps, 'label');
      const cellLabel = getCellLabelByValue(
        legend.axis.x.steps,
        legend.axis.y.steps,
        Number(xValue),
        Number(yValue),
      );
      const cellIndex = cells.findIndex((i) => i.label === cellLabel);

      const popupNode = document.createElement('div');
      createRoot(popupNode).render(
        <MapHexTooltip
          cellLabel={cells[cellIndex].label}
          cellIndex={cellIndex}
          axis={legend.axis}
          values={showValues ? { x: xValue, y: yValue } : undefined}
          hexagonColor={rgba}
        />,
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

  onMapZoom = (ev: maplibregl.MapboxEvent<MapBoxZoomEvent>) => {
    this.cleanPopupWithDeps(ev.target);
  };

  cleanPopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
  }

  cleanHover(map: ApplicationMap) {
    if (map.getSource(HEX_HOVER_SOURCE_ID)) {
      map.removeLayer(HEX_HOVER_LAYER_ID);
      map.removeSource(HEX_HOVER_SOURCE_ID);
    }
  }

  cleanSelection(map: ApplicationMap) {
    if (map.getSource(HEX_SELECTED_SOURCE_ID)) {
      map.removeLayer(HEX_SELECTED_LAYER_ID);
      map.removeSource(HEX_SELECTED_SOURCE_ID);
    }
  }

  cleanPopupWithDeps(map: ApplicationMap) {
    this.cleanPopup();
    this.cleanHover(map);
    this.cleanSelection(map);
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

    this.cleanPopupWithDeps(map);
    map.off('zoom', this.onMapZoom);

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
      this.cleanPopupWithDeps(map);
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
