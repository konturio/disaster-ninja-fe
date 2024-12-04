import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { styleConfigs } from '../stylesConfigs';
import { ClickableTilesRenderer } from '../ClickableTilesRenderer';
import type { LayerSpecification } from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';

export class MultivariateRenderer extends ClickableTilesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
  }

  protected mountLayers(map: ApplicationMap, layer: LayerTileSource, style: LayerStyle) {
    // here is the only change in the method, we use layerStyle instead of generating it from the legend
    const layerId = `${MULTIVARIATE_LAYER_PREFIX + this.id}`;
    if (map.getLayer(layerId)) {
      return;
    }
    const layerStyle =
      style.type === 'multivariate' ? styleConfigs.multivariate(style.config) : null;
    const layerRes = { ...layerStyle, id: layerId, source: this._sourceId };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerRes as LayerSpecification,
      this.id,
    );
    this._layerId = layerId;
  }

  protected generatePopupContent(feature: GeoJSON.Feature, layerStyle: LayerStyle) {
    return <></>;
  }
}
