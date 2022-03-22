import { LayerLegend } from '~core/logical_layers/types/legends';
import { convertRGBtoObj } from '~utils/bivariate/bivariateColorThemeUtils';
import { LayerInAreaDetails } from '../types';

export function legendFormatter(
  legend: LayerInAreaDetails['legend'],
): LayerLegend | null {
  if (!legend) {
    return null;
  }

  if (legend?.type === 'bivariate' && 'axes' in legend) {
    // add opacity .5 to colors
    legend.colors = legend.colors
      .map((clr) => {
        const clrObj = convertRGBtoObj(clr.color);
        return {
          id: clr.id,
          color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`,
        };
      })
      .sort((clr1, clr2) => {
        return clr1.id < clr2.id ? -1 : clr1.id > clr2.id ? 1 : 0;
      });

    return {
      name: legend.name,
      type: 'bivariate',
      axis: { x: legend.axes.x, y: legend.axes.y },
      steps: legend.colors.map((clr) => ({
        label: clr.id,
        color: clr.color,
      })),
    };
  }

  return legend;
}
