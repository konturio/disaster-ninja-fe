import { HashMap } from '../HashMap';
import type { Axis, Stat } from '~utils/bivariate';

export function createBivariateAxesHashMap(stat: Stat) {
  const axesHashMap = new HashMap<Axis>();
  stat.axis.forEach((axis) => {
    axesHashMap.set(axis.quotient[0], axis.quotient[1], axis);
  });
  return axesHashMap;
}
