import type { MultivariateLayerConfig } from '~core/logical_layers/renderers/MultivariateRenderer/types';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Indicator } from '~utils/bivariate';

export function getMaxMultivariateZoomLevel(
  config: MultivariateLayerConfig,
  fallbackMaxZoom: number,
) {
  const maxZoomLevelScore = getMaxMCDAZoomLevel(config.score.config, fallbackMaxZoom);
  const maxZoomLevelBase = config.base
    ? getMaxMCDAZoomLevel(config.base?.config, fallbackMaxZoom)
    : fallbackMaxZoom;
  return Math.max(maxZoomLevelScore, maxZoomLevelBase);
}

export function getMaxMCDAZoomLevel(config: MCDAConfig, fallbackMaxZoom: number) {
  return getMaxNumeratorZoomLevel(
    config.layers.map((axis) => axis.indicators),
    fallbackMaxZoom,
  );
}

export function getMaxNumeratorZoomLevel(
  indicators: Indicator[][],
  fallbackMaxZoom: number,
) {
  const maxIndicatorsZoom = Math.max(
    ...indicators.map((indicators) => indicators[0]?.maxZoom ?? -1),
  );
  if (maxIndicatorsZoom === -1) {
    return fallbackMaxZoom;
  }
  return maxIndicatorsZoom;
}
