import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { styleConfigs } from '../stylesConfigs';
import { ClickableTilesRenderer } from '../ClickableTilesRenderer';
import { SOURCE_LAYER_MCDA } from '../stylesConfigs/mcda/constants';
import type { LabelAxis } from './types';
import type { LayerSpecification } from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';

export class MultivariateRenderer extends ClickableTilesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
  }

  // TODO: Basemap tileserver returns 403 when trying to pull the font from it.
  addTextLayer(map: ApplicationMap, labelAxis: LabelAxis, mainLayerId: string) {
    const layerStyle: LayerSpecification = {
      id: mainLayerId + '-text',
      type: 'symbol',
      layout: {
        'text-field': labelAxis.label,
      },
      source: this._sourceId,
      'source-layer': SOURCE_LAYER_MCDA,
    };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerStyle,
      this.id,
    );
  }

  protected mountLayers(map: ApplicationMap, layer: LayerTileSource, style: LayerStyle) {
    // here is the only change in the method, we use layerStyle instead of generating it from the legend
    const layerId = `${MULTIVARIATE_LAYER_PREFIX + this.id}`;
    if (map.getLayer(layerId)) {
      return;
    }
    let layerStyle;
    if (style.type == 'multivariate') {
      layerStyle = styleConfigs.multivariate(style.config);
      const layerRes = { ...layerStyle, id: layerId, source: this._sourceId };
      layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
        layerRes as LayerSpecification,
        this.id,
      );
      this._layerId = layerId;
      if (style.config.tileLabel) {
        // this.addTextLayer(map, style.config.tileLabel, layerId);
      }
    } else {
      console.error(
        'MultivariateRenderer expected layer type === "multivariate", but got ',
        style.type,
      );
    }
  }

  protected generatePopupContent(feature: GeoJSON.Feature, layerStyle: LayerStyle) {
    return <></>;
  }
}
