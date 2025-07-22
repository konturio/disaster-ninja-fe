import { i18n } from '~core/localization';
import { getDirectAndReversedMCDALayers } from '~utils/mcda/getDirectAndReversedMCDALayers';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

function joinLayerNames(names: string[]): string {
  return names.join(', ');
}

export function getMCDALayersDirectionsForLegend(config: MCDAConfig) {
  const { directLayers, reversedLayers } = getDirectAndReversedMCDALayers(config);
  // high MCDA score
  const reversedLow = reversedLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  const directHigh = directLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';
  // low MCDA score
  const directLow = directLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';
  const reversedHigh = reversedLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';

  const lowMCDAScoreLayersDirections = [reversedLow, directHigh].filter(Boolean);
  const highMCDAScoreLayersDirections = [directLow, reversedHigh].filter(Boolean);
  return { lowMCDAScoreLayersDirections, highMCDAScoreLayersDirections };
}
