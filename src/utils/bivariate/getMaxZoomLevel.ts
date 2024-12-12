import type { MCDAConfig } from '../../core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Indicator } from '~utils/bivariate';

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
