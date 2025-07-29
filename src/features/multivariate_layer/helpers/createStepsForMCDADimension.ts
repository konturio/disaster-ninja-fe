import { DEFAULT_MULTIBIVARIATE_STEPS } from '~utils/multivariate/constants';
import type { MCDALayer } from '~mcda/types';
import type { Axis, Step } from '~utils/bivariate';

export function createStepsForMCDADimension(
  layers: MCDALayer[] | undefined,
  availableAxes: Axis[],
): Step[] {
  if (layers?.length === 1 && layers[0].normalization === 'no') {
    // just one layer with no normalization - use axis data for steps
    const axis = availableAxes.find((axis) => layers[0].id === axis.id);
    return axis?.steps || DEFAULT_MULTIBIVARIATE_STEPS;
  } else {
    // multiple layers or normalized layer - use default steps from 0 to 1
    return DEFAULT_MULTIBIVARIATE_STEPS;
  }
}
