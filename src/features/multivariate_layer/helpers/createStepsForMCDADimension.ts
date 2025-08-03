import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import type { MCDALayer } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { Axis, Step } from '~utils/bivariate';

export function createStepsForMCDADimension(
  layers: MCDALayer[] | undefined,
  availableAxes: Axis[],
): Step[] {
  const visibleLayers = layers?.filter((l) => !l.isHidden);
  if (visibleLayers?.length === 1 && visibleLayers[0].normalization === 'no') {
    // just one layer with no normalization - use axis data for steps
    const axis = availableAxes.find((axis) => visibleLayers[0].id === axis.id);
    return axis?.steps || DEFAULT_MULTIBIVARIATE_STEPS;
  } else {
    // multiple layers or normalized layer - use default steps from 0 to 1
    return DEFAULT_MULTIBIVARIATE_STEPS;
  }
}
