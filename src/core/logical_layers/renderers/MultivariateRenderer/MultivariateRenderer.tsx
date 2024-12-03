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
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { dispatchMetricsEvent } from '~core/metrics/dispatch';
import { styleConfigs } from '../stylesConfigs';
import { generatePopupContent } from '../MCDARenderer/popup';
import { setTileScheme } from '../setTileScheme';
import { BivariateRenderer } from '../BivariateRenderer';
import {
  FALLBACK_BIVARIATE_MIN_ZOOM,
  FALLBACK_BIVARIATE_MAX_ZOOM,
  H3_HOVER_LAYER,
  SOURCE_LAYER_BIVARIATE,
} from '../BivariateRenderer/constants';
import { generateLayerFromLegend } from '../BivariateRenderer/legends';
import { createFeatureStateHandlers } from '../BivariateRenderer/activeAndHoverFeatureStates';
import { isFeatureVisible } from '../BivariateRenderer/featureVisibilityCheck';
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

export class MultivariateRenderer extends BivariateRenderer {
  public readonly id: string;
  protected _sourceId: string;
  protected _layersOrderManager?: LayersOrderManager;
  protected _listenersCleaningTasks = new Set<() => void>();

  public constructor({
    id,
    layersOrderManager,
  }: {
    id: string;
    layersOrderManager?: LayersOrderManager;
  }) {
    super({
      id,
      layersOrderManager,
    });
    this.id = id;
    this._layersOrderManager = layersOrderManager;
    this._sourceId = SOURCE_BIVARIATE_PREFIX + this.id;
  }

  async mountMultivariateLayer(
    map: ApplicationMap,
    layer: LayerTileSource,
    legend: BivariateLegend | null,
  ) {
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
    } else if (style?.type === 'multivariate') {
      this.mountMultivariateLayer(map, layerData, legend);
      // this.addBivariatePopup(map, legend);
    } else {
      this.mountBivariateLayer(map, layerData, legend);
      this.addBivariatePopup(map, legend);
    }

    this.addHoverAndActiveFeatureState(map, style);
    if (!isVisible) this.willHide({ map });
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
}
