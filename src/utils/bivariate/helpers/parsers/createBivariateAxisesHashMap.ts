import { HashMap } from '../HashMap';
import type { Axis, Stat } from '../../types/stat.types';

export function createBivariateAxisesHashMap(stat: Stat) {
  const axisHashMap = new HashMap<Axis>();
  stat.axis.forEach((axis) => {
    axisHashMap.set(axis.quotient[0], axis.quotient[1], axis);
  });
  return axisHashMap;
}
