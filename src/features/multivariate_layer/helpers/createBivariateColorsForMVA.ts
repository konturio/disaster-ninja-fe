import { sentimentReversed } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { arraysAreEqualWithStrictOrder } from '~utils/common/equality';
import { clusterize } from '~utils/bivariate';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { ColorTheme } from '~core/types';

export function createBivariateColorsForMVA(
  scoreLayers: MCDALayer[],
  baseLayers: MCDALayer[],
  defaultColors: ColorTheme,
): ColorTheme {
  let reverseScore = false;
  let reverseBase = false;
  if (scoreLayers.length === 1) {
    reverseScore = arraysAreEqualWithStrictOrder(
      scoreLayers[0].sentiment,
      sentimentReversed,
    );
  }
  if (baseLayers.length === 1) {
    reverseBase = arraysAreEqualWithStrictOrder(
      baseLayers[0].sentiment,
      sentimentReversed,
    );
  }
  const tmpColors = clusterize(defaultColors);
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
    .map((v, index) => ({ id: defaultColors[index].id, color: v.color }));
}
