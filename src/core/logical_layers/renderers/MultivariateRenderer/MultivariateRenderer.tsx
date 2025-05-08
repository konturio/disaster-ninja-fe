import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { getMaxMultivariateZoomLevel } from '~utils/bivariate/getMaxZoomLevel';
import { isNumber } from '~utils/common';
import { styleConfigs } from '../stylesConfigs';
import { ClickableFeaturesRenderer } from '../ClickableFeaturesRenderer';
import {
  FALLBACK_BIVARIATE_MAX_ZOOM,
  FALLBACK_BIVARIATE_MIN_ZOOM,
} from '../BivariateRenderer/constants';
import { multivariateDimensionToScore } from '../stylesConfigs/multivariate/multivariateDimensionToScore';
import { SOURCE_LAYER_MCDA } from '../stylesConfigs/mcda/constants';
import { generateMultivariatePopupContent } from './popup';
import { formatFeatureText } from './helpers/formatFeatureText';
import type { FeatureTextDimension } from './types';
import type {
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';
const TEXT_LAYER_POSTFIX = '-text';

export class MultivariateRenderer extends ClickableFeaturesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
  }

  protected getClickableLayerId(): string {
    return MULTIVARIATE_LAYER_PREFIX + this.id;
  }

  addTextLayer(
    map: ApplicationMap,
    textDimension: FeatureTextDimension,
    mainLayerId: string,
    mainLayerSpecification: LayerSpecification,
  ) {
    let value: any = '';
    if (textDimension?.propertyName) {
      value = ['get', textDimension.propertyName];
    }
    if (textDimension?.valueExpression) {
      value = textDimension?.valueExpression;
    }
    if (textDimension?.axis) {
      value = multivariateDimensionToScore(
        textDimension?.axis,
      ) as DataDrivenPropertyValueSpecification<string>;
    }
    if (textDimension.formatString) {
      value = formatFeatureText(textDimension.formatString, value);
    }
    const filter =
      mainLayerSpecification.type === 'fill' ? mainLayerSpecification.filter : undefined;
    const layerStyle: LayerSpecification = {
      id: mainLayerId + TEXT_LAYER_POSTFIX,
      type: 'symbol',
      layout: {
        'text-field': value,
        'text-font': ['literal', ['Noto Sans Regular']],
        'text-size': 11,
        'symbol-sort-key': textDimension?.sortExpression,
        'symbol-z-order': 'source',
        ...textDimension.layoutProperties,
      },
      paint: {
        ...textDimension.paintProperties,
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

  protected getMinZoomLevel(layer: LayerTileSource): number {
    return isNumber(layer.minZoom) ? layer.minZoom : FALLBACK_BIVARIATE_MIN_ZOOM;
  }

  protected getMaxZoomLevel(layer: LayerTileSource): number {
    if (layer.style?.type !== 'multivariate') {
      return FALLBACK_BIVARIATE_MAX_ZOOM;
    }
    return isNumber(layer.maxZoom)
      ? layer.maxZoom
      : getMaxMultivariateZoomLevel(layer.style.config, FALLBACK_BIVARIATE_MAX_ZOOM);
  }

  protected createPopupContent(
    feature: GeoJSON.Feature,
    layerStyle: LayerStyle,
  ): JSX.Element | null {
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
      const textLayerId = this._layerId + TEXT_LAYER_POSTFIX;
      if (map.getLayer(textLayerId)) {
        map.removeLayer(textLayerId);
      }
    }

    super.willUnMount({ map });
  }
}
