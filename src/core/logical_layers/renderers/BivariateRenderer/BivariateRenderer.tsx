import { Popup as MapPopup } from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import {
  LAYER_BIVARIATE_PREFIX,
  SOURCE_BIVARIATE_PREFIX,
} from '~core/logical_layers/constants';
import { layerByOrder } from '~core/logical_layers';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { registerMapListener } from '~core/shared_state/mapListeners';
import {
  bivariateHexagonPopupContentRoot,
  MapHexTooltip,
} from '~components/MapHexTooltip/MapHexTooltip';
import { invertClusters } from '~utils/bivariate';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { getMaxNumeratorZoomLevel } from '~utils/bivariate/getMaxZoomLevel';
import { styleConfigs } from '../stylesConfigs';
import { generatePopupContent } from '../MCDARenderer/popup';
import { setTileScheme } from '../setTileScheme';
import {
  FALLBACK_BIVARIATE_MIN_ZOOM,
  FALLBACK_BIVARIATE_MAX_ZOOM,
  H3_HOVER_LAYER,
  SOURCE_LAYER_BIVARIATE,
} from './constants';
import { generateLayerFromLegend } from './legends';
import { createFeatureStateHandlers } from './activeAndHoverFeatureStates';
import { isFeatureVisible } from './featureVisibilityCheck';
import type {
  LayerSpecification,
  LineLayerSpecification,
  MapLibreZoomEvent,
  MapMouseEvent,
  VectorSourceSpecification,
} from 'maplibre-gl';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type {
  BivariateLegend,
  BivariateLegendStep,
} from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../../utils/layersOrder/layersOrder';
import type { GeoJsonProperties } from 'geojson';
import type { LayerStyle } from '../../types/style';
import type { RGBAColor } from '~core/types/color';

const convertFillColorToRGBA = (fillColor: RGBAColor, withTransparency = true): string =>
  `rgba(${fillColor.r * 255 * 2},${fillColor.g * 255 * 2},${fillColor.b * 255 * 2}${
    withTransparency ? ',' + fillColor.a : ''
  })`;

const featureFlags = configRepo.get().features;

function calcValueByNumeratorDenominator(
  cellValues: Exclude<GeoJsonProperties, null>,
  numerator: string,
  denominator: string,
): string | undefined {
  const numeratorValue = cellValues[numerator];
  const denominatorValue = cellValues[denominator];
  // is null or undefined
  if (numeratorValue == null || denominatorValue == null) return '0.00';
  if (denominatorValue === 0) return undefined;

  return (numeratorValue / denominatorValue).toFixed(2);
}

export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  protected _layerId?: string;
  protected _sourceId: string;
  protected _layersOrderManager?: LayersOrderManager;
  protected _popup?: MapPopup | null;
  protected _listenersCleaningTasks = new Set<() => void>();
  private cleanUpListeners = () => {
    this._listenersCleaningTasks.forEach((task) => task());
    this._listenersCleaningTasks.clear();
  };

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
    this._sourceId = SOURCE_BIVARIATE_PREFIX + this.id;
  }

  /* Active and hover feature state */
  protected _borderLayerId?: string;
  resetFeatureStates?: () => void;
  async addHoverAndActiveFeatureState(map: ApplicationMap, style: LayerStyle | null) {
    await mapLoaded(map);
    const sourceId = this._sourceId;

    /* Create layer for hover / active effect and add to map */
    const borderLayerId = sourceId + '_border';
    if (map.getLayer(borderLayerId)) {
      return;
    }
    const borderLayerStyle: LineLayerSpecification = {
      ...H3_HOVER_LAYER,
      id: borderLayerId,
      source: sourceId,
      'source-layer': SOURCE_LAYER_BIVARIATE,
    };

    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      borderLayerStyle,
      this.id,
    );

    this._borderLayerId = borderLayerId;

    /* Add event listeners */

    const { onClick, onMouseMove, onMouseLeave, reset } = createFeatureStateHandlers({
      map,
      sourceId,
      sourceLayer: SOURCE_LAYER_BIVARIATE,
    });
    this._listenersCleaningTasks.add(registerMapListener('click', onClick, 60));
    this._listenersCleaningTasks.add(registerMapListener('mousemove', onMouseMove, 60));
    this._listenersCleaningTasks.add(registerMapListener('mouseleave', onMouseLeave, 60));

    this.resetFeatureStates = reset;
  }

  async mountBivariateLayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    legend: BivariateLegend | null,
  ) {
    const maxZoom = getMaxNumeratorZoomLevel(
      [legend?.axis.x.quotients ?? [], legend?.axis.y.quotients ?? []],
      layer.maxZoom || FALLBACK_BIVARIATE_MAX_ZOOM,
    );
    /* Create source */
    const mapSource: VectorSourceSpecification = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: layer.minZoom || FALLBACK_BIVARIATE_MIN_ZOOM,
      maxzoom: maxZoom,
    };
    // I expect that all servers provide url with same scheme
    setTileScheme(layer.source.urls[0], mapSource);

    await mapLoaded(map);
    if (map.getSource(this._sourceId) === undefined) {
      map.addSource(this._sourceId, mapSource);
    }
    /* Create layer */
    if (legend) {
      const layerStyle = generateLayerFromLegend(legend, SOURCE_LAYER_BIVARIATE);
      const layerId = `${LAYER_BIVARIATE_PREFIX + this.id}`;
      if (map.getLayer(layerId)) {
        return;
      }
      const layer = { ...layerStyle, id: layerId, source: this._sourceId };
      layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
        layer as LayerSpecification,
        this.id,
      );
      this._layerId = layer.id;
    } else {
      // We don't known source-layer id
      throw new Error(`[GenericLayer ${this.id}] Vector layers must have legend`);
    }
  }

  removeBivariatePopupClickHandler?: () => void;
  addBivariatePopup(map: ApplicationMap, legend: BivariateLegend | null) {
    const clickHandler = (ev: MapMouseEvent) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));

      if (!features.length || !legend || !features[0].geometry) return true;

      const [feature] = features;
      /* Skip when color empty */
      if (!isFeatureVisible(feature)) return true;
      if (!feature.properties) return true;

      const showValues = featureFlags[AppFeature.BIVARIATE_MANAGER];
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
      const fillColor: RGBAColor = feature.layer.paint?.['fill-color'];
      if (!fillColor) return true;

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
        this.resetFeatureStates?.();
      });

      return true;
    };

    if (this.removeBivariatePopupClickHandler) {
      // Remove old click handler
      this.removeBivariatePopupClickHandler();
      // Remove remover from scheduled for unmount tasks
      this._listenersCleaningTasks.delete(this.removeBivariatePopupClickHandler);
    }

    // Create new click handler fpr showing popup
    const removeClickListener = registerMapListener('click', clickHandler, 60);

    // Schedule removing handler on unmount
    this._listenersCleaningTasks.add(removeClickListener);

    // Save it for next call
    this.removeBivariatePopupClickHandler = removeClickListener;
  }

  async mountMCDALayer(map: ApplicationMap, layer: LayerTileSource, style: LayerStyle) {
    /* Create source */
    const mapSource: VectorSourceSpecification = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: layer.minZoom || FALLBACK_BIVARIATE_MIN_ZOOM,
      maxzoom: layer.maxZoom || FALLBACK_BIVARIATE_MAX_ZOOM,
    };
    // I expect that all servers provide url with same scheme
    setTileScheme(layer.source.urls[0], mapSource);

    await mapLoaded(map);
    if (map.getSource(this._sourceId) === undefined) {
      map.addSource(this._sourceId, mapSource);
    }

    // here is the only change in the method, we use layerStyle instead of generation it from the legend
    const layerId = `${LAYER_BIVARIATE_PREFIX + this.id}`;
    if (map.getLayer(layerId)) {
      return;
    }
    const layerStyle = styleConfigs.mcda(style.config)[0];
    const layerRes = { ...layerStyle, id: layerId, source: this._sourceId };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerRes as LayerSpecification,
      this.id,
    );
    this._layerId = layerId;
  }

  addMCDAPopup(map: ApplicationMap, style: LayerStyle) {
    const clickHandler = (ev: MapMouseEvent) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));

      // Don't show popup when click in empty place
      if (!features.length || !features[0].geometry) return true;

      const [feature] = features;

      // Don't show popup when click on feature that filtered by map style
      if (!isFeatureVisible(feature)) return true;

      // Show popup on click
      const popupNode = generatePopupContent(feature, style.config.layers);
      dispatchMetricsEvent('mcda_popup');
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
        this.resetFeatureStates?.();
      });

      return true;
    };
    this.cleanUpListeners();
    // Click
    const removeClickListener = registerMapListener('click', clickHandler, 60);
    this._listenersCleaningTasks.add(removeClickListener);
  }

  protected _updateMap(
    map: ApplicationMap,
    layerData: LayerTileSource,
    legend: BivariateLegend | null,
    isVisible: boolean,
    style: LayerStyle | null,
  ) {
    if (layerData == null) return;

    if (style?.type === 'mcda') {
      this.mountMCDALayer(map, layerData, style);
      this.addMCDAPopup(map, style);
    } else {
      this.mountBivariateLayer(map, layerData, legend);
      this.addBivariatePopup(map, legend);
    }

    this.addHoverAndActiveFeatureState(map, style);
    if (!isVisible) this.willHide({ map });
  }

  onMapZoom = (ev: maplibregl.MapLibreEvent<MapLibreZoomEvent>) => {
    this.cleanPopup();
  };

  cleanPopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
  }

  /* ========== Hooks ========== */
  willSourceUpdate({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    if (state.source) {
      console.debug(`[${this.id} layer renderer]: Source updated`);
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
        state.isVisible,
        state.style,
      );
    } else {
      console.debug(
        `[${this.id} layer renderer]: Source not available, waiting for next update`,
      );
    }
  }

  willMount({ map, state }: { map: ApplicationMap; state: LogicalLayerState }) {
    map.on('zoom', this.onMapZoom);
    if (state.source) {
      this._updateMap(
        map,
        state.source as LayerTileSource,
        state.legend as BivariateLegend,
        state.isVisible,
        state.style,
      );
    } else {
      console.debug(
        `[${this.id} layer renderer]: Source not available, waiting for next update`,
      );
    }
  }

  willUnMount({ map }: { map: ApplicationMap }) {
    if (this._layerId && map.getLayer(this._layerId)) {
      map.removeLayer(this._layerId);
      this._layerId = undefined;
    } else {
      console.warn(
        `Can't remove layer with ID: ${this._layerId}. Layer does't exist in map`,
      );
    }

    if (this._borderLayerId && map.getLayer(this._borderLayerId)) {
      map.removeLayer(this._borderLayerId);
      this._borderLayerId = undefined;
    } else {
      console.warn(
        `Can't remove layer with ID: ${this._borderLayerId}. Layer does't exist in map`,
      );
    }

    this.cleanPopup();
    this.resetFeatureStates?.();

    if (map.getSource(this._sourceId)) {
      map.removeSource(this._sourceId);
    } else {
      console.warn(
        `Can't remove source with ID: ${this._sourceId}. Source does't exist in map`,
      );
    }
    this.cleanUpListeners();
    map.off('zoom', this.onMapZoom);
  }

  willHide({ map }: { map: ApplicationMap }) {
    if (this._layerId === undefined || map === null) return;

    if (map.getLayer(this._layerId) !== undefined) {
      map.setLayoutProperty(this._layerId, 'visibility', 'none');
      this.cleanPopup();
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
    if (this._layerId === undefined || this._borderLayerId === undefined || map === null)
      return;
    if (
      map.getLayer(this._layerId) !== undefined ||
      map.getLayer(this._borderLayerId) !== undefined
    ) {
      this.willUnMount({ map });
    }
  }
}
