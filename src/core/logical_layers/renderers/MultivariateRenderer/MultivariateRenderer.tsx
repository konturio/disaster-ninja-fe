import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { multivariateAxisToScore, styleConfigs } from '../stylesConfigs';
import { ClickableTilesRenderer } from '../ClickableTilesRenderer';
import { SOURCE_LAYER_MCDA } from '../stylesConfigs/mcda/constants';
import { type LabelAxis } from './types';
import { formatMaplibreString } from './helpers/formatMaplibreString';
import { generateMultivariatePopupContent } from './popup';
import type {
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';
const TEXT_POSTFIX = '-text';

export class MultivariateRenderer extends ClickableTilesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
  }

  protected getClickableLayerId(): string {
    return MULTIVARIATE_LAYER_PREFIX + this.id;
  }

  addTextLayer(
    map: ApplicationMap,
    labelAxis: LabelAxis,
    mainLayerId: string,
    mainLayerSpecification: LayerSpecification,
  ) {
    let value: any = '';
    if (labelAxis?.propertyName) {
      value = ['get', labelAxis.propertyName];
    }
    if (labelAxis?.valueExpression) {
      value = labelAxis?.valueExpression;
    }
    if (labelAxis?.axis) {
      value = multivariateAxisToScore(
        labelAxis?.axis,
      ) as DataDrivenPropertyValueSpecification<string>;
    }
    if (labelAxis.formatString) {
      value = formatMaplibreString(labelAxis.formatString, value);
    }
    const filter =
      mainLayerSpecification.type === 'fill' ? mainLayerSpecification.filter : undefined;
    const layerStyle: LayerSpecification = {
      id: mainLayerId + TEXT_POSTFIX,
      type: 'symbol',
      layout: {
        'text-field': value,
        'text-font': ['literal', ['Noto Sans Regular']],
        'text-size': 11,
        'symbol-sort-key': labelAxis?.sortExpression,
        'symbol-z-order': 'source',
        ...labelAxis.layoutProperties,
      },
      paint: {
        ...labelAxis.paintProperties,
      },
      source: this._sourceId,
      'source-layer': SOURCE_LAYER_MCDA,
      filter,
    };
    layerByOrder(map, this._layersOrderManager).addAboveLayerWithSameType(
      layerStyle,
      this.id,
    );
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
      if (style.config.text) {
        this.addTextLayer(map, style.config.text, layerId, layerRes);
      }
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
      const textLayerId = this._layerId + TEXT_POSTFIX;
      if (map.getLayer(textLayerId)) {
        map.removeLayer(textLayerId);
      }
    }

    super.willUnMount({ map });
  }
}
