import { createRoot } from 'react-dom/client';
import { sumBy } from '~utils/common';
import {
  calculateLayerPipeline,
  inViewCalculations,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations';
import { PopupMCDA } from './components/PopupMCDA';
import type { PopupMCDAProps } from './types';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

function createTableWithCalculations(
  feature: GeoJSON.Feature,
  layers: MCDAConfig['layers'],
) {
  const calculateLayer = calculateLayerPipeline(inViewCalculations, ({ num, den }) => ({
    num: feature.properties?.[num],
    den: feature.properties?.[den],
  }));

  return layers.reduce<PopupMCDAProps['normalized']>((acc, layer) => {
    const [num, den] = layer.axis;
    const value = feature.properties?.[num] / feature.properties?.[den];
    acc[`${num}-${den}`] = {
      val: value,
      norm: calculateLayer(layer),
      numValue: feature.properties?.[num],
      denValue: feature.properties?.[den],
    };
    return acc;
  }, {});
}

function calcMcdaIndex(
  layers: MCDAConfig['layers'],
  normalized: Record<string, { norm: number; val: number }>,
) {
  const sumNormalized = sumBy(Object.values(normalized), 'norm');
  const coeffsSum = sumBy(layers, 'coefficient');
  return sumNormalized / coeffsSum;
}

export function generateMCDAPopupContent(
  feature: GeoJSON.Feature,
  layers: MCDAConfig['layers'],
): HTMLDivElement {
  const normalized = createTableWithCalculations(feature, layers);
  const resultMCDA = calcMcdaIndex(layers, normalized);
  const popupNode = document.createElement('div');
  createRoot(popupNode).render(PopupMCDA({ layers, normalized, resultMCDA }));
  return popupNode;
}
