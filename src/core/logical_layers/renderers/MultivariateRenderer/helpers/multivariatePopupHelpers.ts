import {
  HIGH,
  isBottomSide,
  isLeftSide,
  isRightSide,
  isTopSide,
  LOW,
  MEDIUM,
} from '~components/BivariateLegend/const';
import { invertClusters } from '~utils/bivariate';
import { getCellLabelByValue } from '~utils/bivariate/bivariateLegendUtils';
import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import type { BivariateColorConfig, MultivariateLayerConfig } from '../types';
import type { Cell } from '@konturio/ui-kit/tslib/Legend/types';
import type { ColorTheme } from '~core/types';

function getBaseLevelByindex(index: number): string {
  if (isBottomSide(index)) return LOW;
  if (isTopSide(index)) return HIGH;
  return MEDIUM;
}

function getScoreLevelByindex(index: number): string {
  if (isLeftSide(index)) return LOW;
  if (isRightSide(index)) return HIGH;
  return MEDIUM;
}

export function getCellsForColorTheme(colors: ColorTheme) {
  return invertClusters(
    colors.map(({ id, color, isFallbackColor }) => ({
      label: id,
      color,
      isFallbackColor,
    })),
    'label',
  ) as Cell[];
}

export function getDimensionLevelsAndHexagonParams(
  colors: BivariateColorConfig,
  stepOverrides: MultivariateLayerConfig['stepOverrides'],
  scoreResult: number,
  baseResult: number,
) {
  const hexagonLabel = getCellLabelByValue(
    stepOverrides?.scoreSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
    stepOverrides?.baseSteps ?? DEFAULT_MULTIBIVARIATE_STEPS,
    scoreResult,
    baseResult,
  );
  const hexagonColor = colors?.colors.find((color) => color.id === hexagonLabel)?.color;
  // "high"/"low"/"medium"
  const cells = getCellsForColorTheme(colors.colors);
  const cellIndex = cells.findIndex((i) => i.label === hexagonLabel);
  const scoreLevelLabel = getScoreLevelByindex(cellIndex);
  const baseLevelLabel = getBaseLevelByindex(cellIndex);
  return { hexagonColor, hexagonLabel, scoreLevelLabel, baseLevelLabel };
}
