import { createRoot } from 'react-dom/client';
import { sumBy } from '~utils/common';
import { PopupMCDA } from '../components/PopupMCDA';
import { calculateLayerPipeline, inViewCalculations } from '../calculations';
import type { MCDAConfig, PopupMCDAProps } from '../types';

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
    acc[`${num}-${den}`] = { val: value, norm: calculateLayer(layer) };
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

export function generatePopupContent(
  feature: GeoJSON.Feature,
  layers: MCDAConfig['layers'],
): HTMLDivElement {
  const normalized = createTableWithCalculations(feature, layers);
  const resultMCDA = calcMcdaIndex(layers, normalized);
  const popupNode = document.createElement('div');
  createRoot(popupNode).render(PopupMCDA({ layers, normalized, resultMCDA }));
  return popupNode;
}
