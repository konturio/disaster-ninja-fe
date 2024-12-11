import type { MCDAConfig } from '../types';
import type { Indicator } from '~utils/bivariate';

export function getMaxMCDAZoomLevel(config: MCDAConfig) {
  return Math.max(
    ...config.layers.map((axis) => getMaxIndicatorsZoomLevel(axis.indicators)),
  );
}

export function getMaxIndicatorsZoomLevel(indicators: Indicator[]) {
  return Math.max(...indicators.map((indicator) => indicator.maxZoom ?? -1));
}
