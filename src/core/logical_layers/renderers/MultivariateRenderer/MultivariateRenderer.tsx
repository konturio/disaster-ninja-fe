import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { styleConfigs } from '../stylesConfigs';
import { ClickableTilesRenderer } from '../ClickableTilesRenderer';
import { generateMultivariatePopupContent } from './popup';
import type { LayerSpecification } from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';

export class MultivariateRenderer extends ClickableTilesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
  }

  protected getClickableLayerId(): string {
    return MULTIVARIATE_LAYER_PREFIX + this.id;
  }

  protected mountLayers(map: ApplicationMap, layer: LayerTileSource, style: LayerStyle) {
    // here is the only change in the method, we use layerStyle instead of generating it from the legend
    const layerId = this.getClickableLayerId();
    if (map.getLayer(layerId)) {
      return;
    }
    let layerStyle;
    if (style.type == 'multivariate') {
      layerStyle = styleConfigs.multivariate(style.config)[0];
      const layerRes: LayerSpecification = {
        ...layerStyle,
        id: layerId,
        source: this._sourceId,
      };
      layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
        layerRes,
        this.id,
      );
      this._layerId = layerId;
    } else {
      console.error(
        'MultivariateRenderer expected layer type === "multivariate", but got ',
        style.type,
      );
    }
  }

  protected generatePopupContent(feature: GeoJSON.Feature, layerStyle: LayerStyle) {
    if (layerStyle.type === 'multivariate') {
      return generateMultivariatePopupContent(feature, layerStyle);
    } else {
      console.error('multivariate layer style expected');
      return null;
    }
  }

  willUnMount({ map }: { map: ApplicationMap }): void {
    if (this._layerId) {
      // clean up additional layers like text or extrusion
    }

    super.willUnMount({ map });
  }
}
