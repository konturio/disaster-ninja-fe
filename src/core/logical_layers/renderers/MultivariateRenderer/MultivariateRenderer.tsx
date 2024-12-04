import { layerByOrder } from '~core/logical_layers/utils/layersOrder/layerByOrder';
import { multivariateAxisToScore, styleConfigs } from '../stylesConfigs';
import { ClickableTilesRenderer } from '../ClickableTilesRenderer';
import { SOURCE_LAYER_MCDA } from '../stylesConfigs/mcda/constants';
import type { LabelAxis, MultivariateAxis } from './types';
import type {
  DataDrivenPropertyValueSpecification,
  LayerSpecification,
} from 'maplibre-gl';
import type { LayerTileSource } from '~core/logical_layers/types/source';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';
import type { LayerStyle } from '../../types/style';

const MULTIVARIATE_LAYER_PREFIX = 'multivariate-layer-';

export class MultivariateRenderer extends ClickableTilesRenderer {
  protected getSourcePrefix(): string {
    return 'multivariate-source-';
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
      value = multivariateAxisToScore(labelAxis?.axis);
    }
    const filter =
      mainLayerSpecification.type === 'fill' ? mainLayerSpecification.filter : undefined;
    const layerStyle: LayerSpecification = {
      id: mainLayerId + '-text',
      type: 'symbol',
      layout: {
        'text-field': value,
        'text-font': ['literal', ['Noto Sans Regular']],
        'text-size': 11,
      },
      paint: {
        'text-color': '#333388',
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

  addExtrusionLayer(
    map: ApplicationMap,
    mainLayerId: string,
    mainLayerSpecification: LayerSpecification,
    minExtrusion: MultivariateAxis | number | undefined,
    maxExtrusion: MultivariateAxis | number,
  ) {
    const maxExtrusionValue = [
      '*',
      multivariateAxisToScore(maxExtrusion),
      6000,
    ] as DataDrivenPropertyValueSpecification<number>;
    const minExtrusionValue = (
      minExtrusion !== undefined ? multivariateAxisToScore(maxExtrusion) : 0
    ) as DataDrivenPropertyValueSpecification<number>;
    const extrusionColor = mainLayerSpecification.paint?.['fill-color'];
    const extrusionFilter =
      mainLayerSpecification.type === 'fill' ? mainLayerSpecification.filter : undefined;
    const layerStyle: LayerSpecification = {
      id: mainLayerId + '-extrusion',
      type: 'fill-extrusion',
      filter: extrusionFilter,
      layout: {},
      paint: {
        'fill-extrusion-height': maxExtrusionValue,
        'fill-extrusion-base': minExtrusionValue,
        'fill-extrusion-color': extrusionColor,
        'fill-extrusion-opacity': 0.75,
        'fill-extrusion-vertical-gradient': false,
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
      if (style.config.tileLabel) {
        this.addTextLayer(map, style.config.tileLabel, layerId, layerRes);
      }
      if (style.config.extrusionMax !== undefined && style.config.extrusionMax !== null) {
        this.addExtrusionLayer(
          map,
          layerId,
          layerRes,
          style.config.extrusionMin,
          style.config.extrusionMax,
        );
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
