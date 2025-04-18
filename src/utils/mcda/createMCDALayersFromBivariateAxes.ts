import {
  sentimentDefault,
  sentimentReversed,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations/constants';
import { formatBivariateAxisUnit } from '~utils/bivariate';
import { notificationServiceInstance } from '~core/notificationServiceInstance';
import { i18n } from '~core/localization';
import { generateSigmaRange } from './generateSigmaRange';
import type { Axis } from '~utils/bivariate';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export function createMCDALayersFromBivariateAxes(axes: Axis[]): MCDALayer[] {
  return axes.reduce<MCDALayer[]>((acc, axis) => {
    const numeratorFirstSentiment = axis.quotients?.at(0)?.direction?.at(0);
    const sentimentDirection = numeratorFirstSentiment?.some(
      (sentiment) => sentiment === 'bad',
    )
      ? sentimentDefault
      : sentimentReversed;
    const range = axis.datasetStats
      ? generateSigmaRange(axis.datasetStats, 3)
      : getRangeFromAxisSteps(axis);
    try {
      acc.push({
        id: axis.id,
        name: axis.label,
        axis: axis.quotient,
        indicators: axis.quotients ?? [],
        unit: formatBivariateAxisUnit(axis.quotients),
        range,
        datasetStats: axis.datasetStats,
        sentiment: sentimentDirection,
        outliers: 'clamp',
        coefficient: 1,
        transformationFunction: axis.transformation?.transformation ?? 'no',
        transformation: axis.transformation,
        normalization: 'max-min',
      });
    } catch (e) {
      console.error(e);
      notificationServiceInstance.error({
        title: 'Error',
        description: i18n.t('mcda.error_bad_layer_data'),
      });
    }
    return acc;
  }, []);
}

// TODO: remove once all presets contain datasetStats
function getRangeFromAxisSteps(axis: Axis): [number, number] {
  const minStep = axis.steps.at(0)?.value;
  const maxStep = axis.steps.at(-1)?.value;
  if (typeof minStep === 'number' && typeof maxStep === 'number') {
    return [minStep, maxStep];
  } else {
    throw Error('incorrect_axis_step_format');
  }
}
