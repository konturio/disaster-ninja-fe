import { sentimentReversed } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import { DEFAULT_MULTIBIVARIATE_COLORS } from '~utils/multivariate/constants';
import { clusterize } from '~utils/bivariate';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { ColorTheme } from '~core/types';

export function createBivariateColorsForMVA(
  score: MCDAConfig,
  base: MCDAConfig,
): ColorTheme {
  let reverseScore = false;
  let reverseBase = false;
  if (score.layers?.length === 1) {
    reverseScore = arraysAreEqualWithStrictOrder(
      score.layers[0].sentiment,
      sentimentReversed,
    );
  }
  if (base.layers?.length === 1) {
    reverseBase = arraysAreEqualWithStrictOrder(
      base.layers[0].sentiment,
      sentimentReversed,
    );
  }
  const tmpColors = clusterize(DEFAULT_MULTIBIVARIATE_COLORS);
  if (reverseScore) {
    // reverse colors vertically
    tmpColors.reverse();
  }
  if (reverseBase) {
    // reverse colors horizontally
    for (const row of tmpColors) {
      row.reverse();
    }
  }
  // match colors with default class names
  return tmpColors
    .flat()
    .map((v, index) => ({ color: v.color, id: DEFAULT_MULTIBIVARIATE_COLORS[index].id }));
}
