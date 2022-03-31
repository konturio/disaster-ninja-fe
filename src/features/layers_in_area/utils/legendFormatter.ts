import {
  BivariateLegendStep,
  LayerLegend,
} from '~core/logical_layers/types/legends';
import { convertRGBtoObj } from '~utils/bivariate/bivariateColorThemeUtils';
import { LayerInAreaDetails } from '../types';

function convertBivariateColorsToSteps(
  colors: { id: string; color: string }[],
): BivariateLegendStep[] {
  return colors
    .map(({ id, color }) => {
      const clrObj = convertRGBtoObj(color);
      return {
        label: id,
        color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`,
      };
    })
    .sort((stp1, stp2) => {
      return stp1.label < stp2.label ? -1 : stp1.label > stp2.label ? 1 : 0;
    });
}

export function legendFormatter(
  details: LayerInAreaDetails,
): LayerLegend | null {
  if (!details.legend) {
    return null;
  }

  if (details.legend?.type === 'bivariate') {
    return {
      name: details.id,
      type: 'bivariate',
      axis: {
        x: details.legend.axes.x,
        y: details.legend.axes.y,
      },
      steps: convertBivariateColorsToSteps(details.legend.colors),
    };
  }

  return details.legend;
}

export function convertDetailsToLegends(
  response: LayerInAreaDetails,
): LayerLegend | null {
  if (!response.legend) return null;
  return legendFormatter(response);
}
