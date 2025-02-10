import { createRoot } from 'react-dom/client';
import { PopupMultivariate as PopupMultivariate } from './components/PopupMultivariate';
import type { MultivariateLayerStyle } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function generateMultivariatePopupContent(
  feature: GeoJSON.Feature,
  layerStyle: MultivariateLayerStyle,
): HTMLDivElement | null {
  const popupNode = document.createElement('div');
  createRoot(popupNode).render(PopupMultivariate(feature, layerStyle.config));
  return popupNode;
}
