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
  getMaxMCDAZoomLevel,
  getMaxNumeratorZoomLevel,
} from '~utils/bivariate/getMaxZoomLevel';
import { isNumber } from '~utils/common';
import { mapPopoverRegistry } from '~core/map/popover/globalMapPopoverRegistry';
import { styleConfigs } from '../stylesConfigs';
import { setTileScheme } from '../setTileScheme';
import { createFeatureStateHandlers } from '../helpers/activeAndHoverFeatureStates';
import {
  BivariatePopoverProvider,
  MCDAPopoverProvider,
} from './BivariatePopoverProviders';
import {
  FALLBACK_BIVARIATE_MIN_ZOOM,
  FALLBACK_BIVARIATE_MAX_ZOOM,
  H3_HOVER_LAYER,
  SOURCE_LAYER_BIVARIATE,
} from './constants';
import { generateLayerFromLegend } from './legends';
import type { MCDALayerStyle } from '../stylesConfigs/mcda/types';
import type {
  LayerSpecification,
  LineLayerSpecification,
  MapLibreZoomEvent,
  VectorSourceSpecification,
} from 'maplibre-gl';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { LogicalLayerState } from '~core/logical_layers/types/logicalLayer';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { LayersOrderManager } from '../../utils/layersOrder/layersOrder';
import type { LayerStyle } from '../../types/style';

// Helper functions moved to BivariatePopoverProviders.tsx

export class BivariateRenderer extends LogicalLayerDefaultRenderer {
  public readonly id: string;
  protected _layerId?: string;
  protected _sourceId: string;
  protected _layersOrderManager?: LayersOrderManager;
  protected _listenersCleaningTasks = new Set<() => void>();
  private _bivariateProvider: BivariatePopoverProvider | null = null;
  private _mcdaProvider: MCDAPopoverProvider | null = null;
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
      throw new Error(`[Bivariate ${this.id}] Vector layers must have legend`);
    }
  }

  // Register bivariate popover provider with registry
  registerBivariateProvider(legend: BivariateLegend | null) {
    if (this._bivariateProvider) {
      mapPopoverRegistry.unregister(`bivariate-${this._sourceId}`);
      this._bivariateProvider = null;
    }

    if (legend) {
      this._bivariateProvider = new BivariatePopoverProvider(this._sourceId, legend);
      mapPopoverRegistry.register(`bivariate-${this._sourceId}`, this._bivariateProvider);
    }
  }

  async mountMCDALayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    style: MCDALayerStyle,
  ) {
    const minZoomLevel = isNumber(layer.minZoom)
      ? layer.minZoom
      : FALLBACK_BIVARIATE_MIN_ZOOM;
    const maxZoomLevel = isNumber(layer.maxZoom)
      ? layer.maxZoom
      : getMaxMCDAZoomLevel(style.config, FALLBACK_BIVARIATE_MAX_ZOOM);
    /* Create source */
    const mapSource: VectorSourceSpecification = {
      type: 'vector',
      tiles: layer.source.urls.map((url) => adaptTileUrl(url)),
      minzoom: minZoomLevel,
      maxzoom: maxZoomLevel,
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
    const layerStyle: LayerSpecification = styleConfigs.mcda(style.config)[0];
    const layerRes = { ...layerStyle, id: layerId, source: this._sourceId };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerRes as LayerSpecification,
      this.id,
    );
    this._layerId = layerId;
  }

  // Register MCDA popover provider with registry
  registerMCDAProvider(style: MCDALayerStyle | null) {
    if (this._mcdaProvider) {
      mapPopoverRegistry.unregister(`mcda-${this._sourceId}`);
      this._mcdaProvider = null;
    }

    if (style) {
      this._mcdaProvider = new MCDAPopoverProvider(this._sourceId, style);
      mapPopoverRegistry.register(`mcda-${this._sourceId}`, this._mcdaProvider);
    }
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
      this.registerMCDAProvider(style);
    } else {
      this.mountBivariateLayer(map, layerData, legend);
      this.registerBivariateProvider(legend);
    }

    this.addHoverAndActiveFeatureState(map, style);
    if (!isVisible) this.willHide({ map });
  }

  onMapZoom = (ev: maplibregl.MapLibreEvent<MapLibreZoomEvent>) => {
    // Registry-based popovers handle their own cleanup on zoom
  };

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

    // Unregister popover providers
    if (this._bivariateProvider) {
      mapPopoverRegistry.unregister(`bivariate-${this._sourceId}`);
      this._bivariateProvider = null;
    }
    if (this._mcdaProvider) {
      mapPopoverRegistry.unregister(`mcda-${this._sourceId}`);
      this._mcdaProvider = null;
    }

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
      // Registry-based popovers handle their own cleanup when layer is hidden
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
