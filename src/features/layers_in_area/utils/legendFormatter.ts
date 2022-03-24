import { BivariateLegendStep, LayerLegend } from '~core/logical_layers/types/legends';
import { convertRGBtoObj } from '~utils/bivariate/bivariateColorThemeUtils';
import { LayerInAreaDetails } from '../types';

function convertBivariateColorsToSteps(colors: Record<string, string>): BivariateLegendStep[] {
  return Object.entries(colors).map(([key, val]) => {
    const clrObj = convertRGBtoObj(val);
    return {
      label: key,
      color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`,
    }
  }).sort((stp1, stp2) => {
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
        x: details.legend.bivariateAxes.x,
        y: details.legend.bivariateAxes.y,
      },
      steps: convertBivariateColorsToSteps(details.legend.bivariateColors)
    };
  }

  return details.legend;
}
