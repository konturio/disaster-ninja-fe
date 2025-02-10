import { Popup as MapPopup } from 'maplibre-gl';
import { createRoot } from 'react-dom/client';
import { LogicalLayerDefaultRenderer } from '~core/logical_layers/renderers/DefaultRenderer';
import { layerByOrder } from '~core/logical_layers';
import { adaptTileUrl } from '~utils/bivariate/tile/adaptTileUrl';
import { mapLoaded } from '~utils/map/waitMapEvent';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { bivariateHexagonPopupContentRoot } from '~components/MapHexTooltip/MapHexTooltip';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { setTileScheme } from '../setTileScheme';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
  SOURCE_LAYER_BIVARIATE,
} from '../BivariateRenderer/constants';
import { createFeatureStateHandlers } from '../helpers/activeAndHoverFeatureStates';
import { H3_HOVER_LAYER } from '../BivariateRenderer/constants';
import { isFeatureVisible } from '../helpers/featureVisibilityCheck';
import type {
  LineLayerSpecification,
  MapLibreZoomEvent,
  MapMouseEvent,
  VectorSourceSpecification,
} from 'maplibre-gl';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerLegend } from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../../utils/layersOrder/layersOrder';
import type { LayerStyle } from '../../types/style';

export abstract class ClickableFeaturesRenderer extends LogicalLayerDefaultRenderer {
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
    this._sourceId = this.getSourcePrefix() + this.id;
  }

  protected abstract getSourcePrefix(): string;
  protected abstract getClickableLayerId(): string;

  protected abstract mountLayers(
    map: ApplicationMap,
    layer: LayerTileSource,
    style: LayerStyle,
  );

  protected abstract createPopupContent(
    feature: GeoJSON.Feature,
    layerStyle: LayerStyle,
  ): JSX.Element | null;

  protected createTileSource(
    map: ApplicationMap,
    layer: LayerTileSource,
  ): VectorSourceSpecification {
    /* Create source */
    const mapSource: VectorSourceSpecification = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: layer.minZoom || FALLBACK_BIVARIATE_MIN_ZOOM,
      maxzoom: layer.maxZoom || FALLBACK_BIVARIATE_MAX_ZOOM,
    };
    // I expect that all servers provide url with same scheme
    setTileScheme(layer.source.urls[0], mapSource);

    return mapSource;
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

  addPopup(map: ApplicationMap, style: LayerStyle) {
    const clickHandler = (ev: MapMouseEvent) => {
      const features = ev.target
        .queryRenderedFeatures(ev.point)
        .filter((f) => f.source.includes(this._sourceId));

      // Don't show popup when click in empty place
      if (!features.length || !features[0].geometry) return true;

      const clickableLayerId = this.getClickableLayerId();
      const feature = features.find((f) => f.layer.id === clickableLayerId);

      // Don't show popup when click on feature that filtered by map style
      if (!feature || !isFeatureVisible(feature)) return true;

      // Show popup on click
      const popupNode = document.createElement('div');
      const popupContent = this.createPopupContent(feature, style);
      createRoot(popupNode).render(popupContent);
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

  protected async _updateMap(
    map: ApplicationMap,
    layerData: LayerTileSource,
    legend: LayerLegend | null,
    isVisible: boolean,
    style: LayerStyle | null,
  ) {
    if (layerData == null) return;
    const tileSourceSpec: VectorSourceSpecification = this.createTileSource(
      map,
      layerData,
    );
    await mapLoaded(map);
    if (map.getSource(this._sourceId) === undefined) {
      map.addSource(this._sourceId, tileSourceSpec);
    }

    if (style) {
      this.mountLayers(map, layerData, style);
      this.addPopup(map, style);
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
        state.legend,
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
        state.legend,
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
