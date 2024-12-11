import type { MCDAConfig } from '../types';
import type { Indicator } from '~utils/bivariate';

export function getMaxMCDAZoomLevel(config: MCDAConfig, fallbackMaxZoom: number) {
  return getMaxIndicatorsZoomLevel(
    config.layers.flatMap((axis) => axis.indicators),
    fallbackMaxZoom,
  );
}

export function getMaxIndicatorsZoomLevel(
  indicators: Indicator[],
  fallbackMaxZoom: number,
) {
  const maxIndicatorsZoom = Math.max(
    ...indicators.map((indicator) => indicator.maxZoom ?? -1),
  );
  if (maxIndicatorsZoom === -1) {
    return fallbackMaxZoom;
  }
  return maxIndicatorsZoom;
}
