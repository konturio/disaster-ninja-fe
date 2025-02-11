import { PopupMultivariate as PopupMultivariate } from './components/PopupMultivariate';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function generateMultivariatePopupContent(
  feature: GeoJSON.Feature,
  layerStyle: MultivariateLayerStyle,
): JSX.Element {
  return PopupMultivariate(feature, layerStyle.config);
}
