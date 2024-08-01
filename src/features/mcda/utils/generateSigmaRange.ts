import type { AxisDatasetStats } from '~utils/bivariate';

export const generateSigmaRange = (
  stats: AxisDatasetStats,
  numberOfSigmas: number,
): [number, number] => [
  Math.max(stats.mean - numberOfSigmas * stats.stddev, stats.minValue),
  Math.min(stats.mean + numberOfSigmas * stats.stddev, stats.maxValue),
];
