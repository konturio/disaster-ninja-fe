import { Popup as MapPopup } from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { haveValue, throttle } from '~utils/common';
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
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { styleConfigs } from '../stylesConfigs';
import { generatePopupContent } from '../MCDARenderer/popup';
import {
  HEX_SELECTED_SOURCE_ID,
  HEX_SELECTED_LAYER_ID,
  ACTIVE_HEXAGON_BORDER,
  HEX_HOVER_SOURCE_ID,
  HEX_HOVER_LAYER_ID,
  HOVER_HEXAGON_BORDER,
} from './constants';
import { generateLayerFromLegend } from './legends';
import { setTileScheme } from './setTileScheme';
import { getH3Polygon } from './h3';
import type { AnyLayer, VectorSource, MapBoxZoomEvent } from 'maplibre-gl';
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

export type FillColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

const isFillColorEmpty = (fillColor: FillColor): boolean =>
  fillColor.a === 0 && fillColor.r === 0 && fillColor.g === 0 && fillColor.b === 0;

const convertFillColorToRGBA = (fillColor: FillColor, withTransparency = true): string =>
  `rgba(${fillColor.r * 255 * 2},${fillColor.g * 255 * 2},${fillColor.b * 255 * 2}${
    withTransparency ? ',' + fillColor.a : ''
  })`;

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

/**
 * mapLibre have very expensive event handler with getClientRects. Sometimes it took almost ~1 second!
 * I found that if i call setLayer by requestAnimationFrame callback - UI becomes much more responsive!
 */
export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  protected _layerId?: string;
  protected _mcdaBorderLayerId?: string;
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
    setTileScheme(layer.source.urls[0], mapSource);

    await mapLoaded(map);
    if (map.getSource(this._sourceId) === undefined) {
      map.addSource(this._sourceId, mapSource);
    }
    /* Create layer */
    if (legend) {
      const layerStyle = generateLayerFromLegend(legend);
      const layerId = `${LAYER_BIVARIATE_PREFIX + this.id}`;
      if (map.getLayer(layerId)) {
        return;
      }
      const layer = { ...layerStyle, id: layerId, source: this._sourceId };
      layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
        layer as AnyLayer,
        this.id,
      );
      this._layerId = layer.id;
    } else {
      // We don't known source-layer id
      throw new Error(`[GenericLayer ${this.id}] Vector layers must have legend`);
    }
  }

  addBivariatePopup(map: ApplicationMap, legend: BivariateLegend | null) {
    const clickHandler = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));

      if (!features.length || !legend || !features[0].geometry) return true;

      const feature = features[0];
      /* Skip when h3 missing */
      if (feature?.properties?.h3 === undefined) return true;

      const geometry = getH3Polygon(feature.properties.h3);
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];

      /* Skip when color empty */
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

    const hoverEffect = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      const features = ev.target.queryRenderedFeatures(ev.point);

      if (
        !features.length ||
        !features[0].geometry ||
        !features[0]?.source.includes(this._sourceId) // we want to process hover only if top layer is bivariate
      ) {
        return;
      }

      const feature = features[0];
      if (feature?.properties?.h3 === undefined) {
        return;
      }

      const geometry = getH3Polygon(feature.properties.h3);
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];
      if (!fillColor || isFillColorEmpty(fillColor)) {
        return;
      }

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
    };

    this.cleanUpListeners();
    const throttledHoverEffect = throttle(hoverEffect, 100);

    map.on('zoom', this.onMapZoom);
    this._listenersCleaningTasks.add(() => map.off('zoom', this.onMapZoom));
    const mousemoveHandler = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      throttledHoverEffect(ev);
      return true;
    };

    const removeMouseMoveListener = registerMapListener(
      'mousemove',
      mousemoveHandler,
      60,
    );
    this._listenersCleaningTasks.add(removeMouseMoveListener);

    const removeClickListener = registerMapListener('click', clickHandler, 60);
    this._listenersCleaningTasks.add(removeClickListener);
  }

  featureStates = {
    hover: 'hover',
    active: 'active',
    default: 'default',
  } as const;
  async mountMCDALayer(map: ApplicationMap, layer: LayerTileSource, style: LayerStyle) {
    /* Create source */
    const mapSource: VectorSource = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: layer.minZoom || 0,
      maxzoom: layer.maxZoom || 22,
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
      layerRes as AnyLayer,
      this.id,
    );
    this._layerId = layerId;

    /**
     * TODO: move it to MCDA layer config
     * Create layer that will used for hover and click effects
     */
    const mcdaBorderLayerId = layerId + '_border';
    if (map.getLayer(mcdaBorderLayerId)) {
      return;
    }
    const borderLayerStyle = {
      type: 'line',
      source: HEX_HOVER_SOURCE_ID,
      layout: {},
      paint: {
        'line-color': [
          'case',
          // prettier-ignore :hover
          ['==', ['feature-state', 'state'], this.featureStates.hover],
          HOVER_HEXAGON_BORDER,
          // prettier-ignore :active
          ['==', ['feature-state', 'state'], this.featureStates.active],
          ACTIVE_HEXAGON_BORDER,
          // not selected
          'rgba(0, 0, 0, 0)',
        ],
        'line-width': 1,
      },
    };
    const borderLayerRes = {
      ...borderLayerStyle,
      id: mcdaBorderLayerId,
      source: this._sourceId,
    };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      borderLayerRes as AnyLayer,
      this.id,
    );
    this._mcdaBorderLayerId = mcdaBorderLayerId;
    /* end TODO */
  }

  private hoveredFeatureId?: string | number | null;
  addMCDAPopup(map: ApplicationMap, style: LayerStyle) {
    const layerId = this._layerId;
    const sourceId = this._sourceId;
    if (layerId === undefined || sourceId === undefined) {
      console.error('Attempt register popup before layer created');
      return;
    }

    this.cleanUpListeners();

    let onMouseMove = (e: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      if (e.features.length > 0) {
        // Reset previous hover
        if (haveValue(this.hoveredFeatureId)) {
          map.setFeatureState(
            { source: this._sourceId, id: this.hoveredFeatureId },
            { state: this.featureStates.default },
          );
        }
        // Setup new hover
        this.hoveredFeatureId = e.features[0].id;
        if (haveValue(this.hoveredFeatureId)) {
          map.setFeatureState(
            { source: this._sourceId, id: this.hoveredFeatureId },
            { state: this.featureStates.hover },
          );
        }
      }
      return true;
    };

    let onMouseLeave = (_) => {
      // Reset previous hover
      if (haveValue(this.hoveredFeatureId)) {
        map.setFeatureState(
          { source: this._sourceId, id: this.hoveredFeatureId },
          { state: this.featureStates.default },
        );
      }
      // Setup new hover
      this.hoveredFeatureId = null;
      return true;
    };

    /**
     * TODO: It would be better to add listener directly to layer,
     * ```
     * map.on('mousemove', layerId, onMouseLeave);
     * map.on('mouseleave', layerId, onMouseLeave);
     * ```
     * but current logic with centralized storage for all map listeners not support it yet.
     * Next code allow kind of emulate that behavior
     **/
    const forLayer =
      (
        layerId: string,
        cb: (e: maplibregl.MapMouseEvent & maplibregl.EventData) => boolean,
      ) =>
      (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
        const features = ev.target
          .queryRenderedFeatures(ev.point)
          .filter((f) => f.layer.id === layerId);
        const evCopy = Object.assign({}, ev);
        evCopy.features = features;
        return cb(evCopy);
      };
    onMouseMove = forLayer(layerId, onMouseMove);
    onMouseLeave = forLayer(layerId, onMouseLeave);

    /** TODO end */

    const clickHandler = (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      const features = ev.features;

      // Don't show popup when click in empty place
      if (!features.length || !features[0].geometry) return true;

      const [feature] = features;
      const fillColor: FillColor = feature.layer.paint?.['fill-color'];

      // Don't show popup when click on feature that filtered by map style
      if (!fillColor || isFillColorEmpty(fillColor) || !feature.properties) return true;

      // Show popup on click
      const popupNode = generatePopupContent(feature, style.config.layers);
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

      // Reset previous state
      if (haveValue(this.hoveredFeatureId)) {
        map.setFeatureState(
          { source: this._sourceId, id: this.hoveredFeatureId },
          { state: this.featureStates.default },
        );
      }

      // Setup new state
      this.hoveredFeatureId = features[0].id;
      if (haveValue(this.hoveredFeatureId)) {
        map.setFeatureState(
          { source: this._sourceId, id: this.hoveredFeatureId },
          { state: this.featureStates.active },
        );
      }

      return true;
    };
    // Click
    const removeClickListener = registerMapListener('click', clickHandler, 60);
    this._listenersCleaningTasks.add(removeClickListener);
    // Zoom
    map.on('zoom', this.onMapZoom);
    this._listenersCleaningTasks.add(() => map.off('zoom', this.onMapZoom));
    // Hover
    const removeMouseMoveListener = registerMapListener('mousemove', onMouseMove, 60);
    this._listenersCleaningTasks.add(removeMouseMoveListener);

    const removeMouseLeaveListener = registerMapListener('mouseleave', onMouseLeave, 60);
    this._listenersCleaningTasks.add(removeMouseLeaveListener);
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
    // For bivariate layer
    if (map.getSource(HEX_HOVER_SOURCE_ID)) {
      map.removeLayer(HEX_HOVER_LAYER_ID);
      map.removeSource(HEX_HOVER_SOURCE_ID);
    }
    // For mcda layer
    if (haveValue(this.hoveredFeatureId)) {
      map.setFeatureState(
        { source: this._sourceId, id: this.hoveredFeatureId },
        { state: this.featureStates.default },
      );
    }
  }

  cleanSelection(map: ApplicationMap) {
    // For bivariate layer
    if (map.getSource(HEX_SELECTED_SOURCE_ID)) {
      map.removeLayer(HEX_SELECTED_LAYER_ID);
      map.removeSource(HEX_SELECTED_SOURCE_ID);
    }
    // For mcda layer
    if (haveValue(this.hoveredFeatureId)) {
      map.setFeatureState(
        { source: this._sourceId, id: this.hoveredFeatureId },
        { state: this.featureStates.default },
      );
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
        state.style,
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
        state.style,
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

    if (this._mcdaBorderLayerId && map.getLayer(this._mcdaBorderLayerId)) {
      map.removeLayer(this._mcdaBorderLayerId);
      this._mcdaBorderLayerId = undefined;
    } else {
      console.warn(
        `Can't remove layer with ID: ${this._mcdaBorderLayerId}. Layer does't exist in map`,
      );
    }

    this.cleanPopupWithDeps(map);

    if (map.getSource(this._sourceId)) {
      map.removeSource(this._sourceId);
    } else {
      console.warn(
        `Can't remove source with ID: ${this._sourceId}. Source does't exist in map`,
      );
    }

    this.cleanUpListeners();
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
    if (
      this._layerId === undefined ||
      this._mcdaBorderLayerId === undefined ||
      map === null
    )
      return;
    if (
      map.getLayer(this._layerId) !== undefined ||
      map.getLayer(this._mcdaBorderLayerId) !== undefined
    ) {
      this.willUnMount({ map });
    }
  }
}
