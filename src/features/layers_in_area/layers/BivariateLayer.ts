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

function isValidTimestamp(_timestamp) {
  const dt = new Date(_timestamp);
  const newTimestamp = new Date(_timestamp).getTime();
  return isNumeric(newTimestamp) && dt.getFullYear() > 1970;
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

const makeLabel = (step) => {
  let parsed = parseFloat(step);
  if (!isNaN(parsed)) {
    parsed *= 1000;
    if (isValidTimestamp(parsed)) {
      const date = new Date(parsed);
      return `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`;
    }
  }
  return '';
};

export function createBivariateLayerFromPreset(layer: LayerInArea) {
  const bl = layer.legend as BivariateLegendBackend;
  const xAxis = {
    ...bl.axises.x,
    steps: bl.axises.x.steps.map((stp) => ({
      value: stp,
      label: makeLabel(stp),
    })),
  };
  const yAxis = {
    ...bl.axises.y,
    steps: bl.axises.y.steps.map((stp) => ({
      value: stp,
      label: makeLabel(stp),
    })),
  };
  bl.axises = { x: xAxis, y: yAxis } as any;

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
    axis: { x: yAxis, y: xAxis } as any,
    copyrights: layer.copyrights || [],
    description: layer.description || '',
    steps: bl.colors.map((clr) => ({ label: clr.id, color: clr.color })),
  };

  return new BivariateManagerLayer(layer.name, bivariateStyle, bivariateLegend);
}
