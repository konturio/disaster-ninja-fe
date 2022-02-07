import { BivariateLayer as BivariateManagerLayer } from '~features/bivariate_manager/layers/BivariateLayer';
import {
  BivariateLegend,
  BivariateLegendBackend,
} from '~core/logical_layers/createLogicalLayerAtom/types';
import {
  convertRGBtoObj,
  generateLayerStyleFromBivariateLegendBackend,
} from '~utils/bivariate/bivariateColorThemeUtils';
import { LayerInArea } from '../types';

export function createBivariateLayerFromPreset(layer: LayerInArea) {
  const bl = layer.legend as BivariateLegendBackend;

  // add opacity .5 to colors
  bl.colors = bl.colors.map((clr) => {
    const clrObj = convertRGBtoObj(clr.color);
    return {
      id: clr.id,
      color: `rgba(${clrObj.r},${clrObj.g},${clrObj.b},0.5)`,
    };
  });

  const bivariateStyle = generateLayerStyleFromBivariateLegendBackend(bl);
  const bivariateLegend: BivariateLegend = {
    name: layer.name,
    type: 'bivariate',
    axis: { x: bl.axes.y, y: bl.axes.x },
    copyrights: layer.copyrights || [],
    description: layer.description || '',
    steps: bl.colors.map((clr) => ({ label: clr.id, color: clr.color })),
  };

  return new BivariateManagerLayer({
    name: layer.name,
    id: layer.id,
    layerStyle: bivariateStyle,
    legend: bivariateLegend,
  });
}
