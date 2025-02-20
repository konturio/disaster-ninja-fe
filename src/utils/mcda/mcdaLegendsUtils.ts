import {
  DEFAULT_GREEN,
  DEFAULT_RED,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { generateHclGradientColors } from './generateHclGradientColors';
import type { ColorsBySentiments } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function generateMCDALegendColors(colors: ColorsBySentiments) {
  const colorGood = colors.parameters?.good ?? DEFAULT_GREEN;
  const colorBad = colors.parameters?.bad ?? DEFAULT_RED;
  /* TODO: using midpoints for gradient customization is a temporary solution.
          It will probably be removed in the future in favor of working with Color Manager */
  const colorMidpoints =
    colors.parameters?.midpoints?.map(
      (point) => `${point.color} ${point.value * 100}%`,
    ) ?? null;
  if (colorMidpoints?.length) {
    return [colorBad.toString(), ...colorMidpoints, colorGood.toString()];
  } else {
    return generateHclGradientColors(colorBad.toString(), colorGood.toString(), 5);
  }
}
