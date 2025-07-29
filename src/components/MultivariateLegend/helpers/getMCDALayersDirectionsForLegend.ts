import { i18n } from '~core/localization';
import { getDirectAndReversedMCDALayers } from '~utils/mcda/getDirectAndReversedMCDALayers';
import type { MCDAConfig } from '~mcda/types';

function joinLayerNames(names: string[]): string {
  return names.join(', ');
}

export function getMCDALayersDirectionsForLegend(config: MCDAConfig) {
  const { directLayers, reversedLayers } = getDirectAndReversedMCDALayers(config);
  // low MCDA score
  const directLow = directLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';
  const reversedHigh = reversedLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';
  // high MCDA score
  const directHigh = directLayers.length
    ? `${i18n.t('bivariate.legend.high')} ${joinLayerNames(directLayers.map((v) => v.name))}`
    : '';
  const reversedLow = reversedLayers.length
    ? `${i18n.t('bivariate.legend.low')} ${joinLayerNames(reversedLayers.map((v) => v.name))}`
    : '';

  const lowMCDAScoreLayersDirections = [directLow, reversedHigh].filter(Boolean);
  const highMCDAScoreLayersDirections = [directHigh, reversedLow].filter(Boolean);
  return { lowMCDAScoreLayersDirections, highMCDAScoreLayersDirections };
}
