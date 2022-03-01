import { LayerLegend } from '~core/logical_layers/types/legends';
import { LayerInArea } from '~features/layers_in_area/types';
import { convertRGBtoObj } from '~utils/bivariate/bivariateColorThemeUtils';

export function legendFormatter(layer: Omit<LayerInArea, 'source'>): LayerLegend | null {
  if (!layer.legend) {
    return null;
  }

  if (layer.legend?.type === 'bivariate' && 'axes' in layer.legend) {
    // add opacity .5 to colors
    layer.legend.colors = layer.legend.colors.map((clr) => {
      const clrObj = convertRGBtoObj(clr.color);
      return {
        id: clr.id,
        color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`,
      };
    });

    return {
      name: layer.name,
      type: 'bivariate',
      axis: { x: layer.legend.axes.y, y: layer.legend.axes.x },
      copyrights: layer.copyrights || [],
      description: layer.description || '',
      steps: layer.legend.colors.map((clr) => ({ label: clr.id, color: clr.color })),
    };
  }

  return layer.legend;
}
