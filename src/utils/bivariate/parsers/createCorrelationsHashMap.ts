import { HashMap } from '../utils/classes/HashMap';
import { Stat, CorrelationRate, Axis } from '../types/stat.types';

export function createCorrelationsHashMap(
  stat: Stat,
  bivariateAxisesHashMap: HashMap<Axis>,
) {
  const correlationsHashMap = new HashMap<CorrelationRate>(true);
  stat.correlationRates.forEach((correlationRate) => {
    /*
       Pass full axis details to correlations from Stats.Axis
       We have to do this because Stats.Corellations doesn't contain full Axis information
    */

    // clone object to get rid of readonly properties
    const cRate = { ...correlationRate };
    const xAxis = bivariateAxisesHashMap.get(
      cRate.x.quotient[0],
      cRate.x.quotient[1],
    ) as Axis;
    if (xAxis) {
      cRate.x = { ...cRate.x, quality: xAxis.quality };
    }
    const yAxis = bivariateAxisesHashMap.get(
      cRate.y.quotient[0],
      cRate.y.quotient[1],
    ) as Axis;
    if (yAxis) {
      cRate.y = { ...cRate.y, quality: yAxis.quality };
    }
    correlationsHashMap.set(cRate.x.quotient[1], cRate.y.quotient[1], cRate);
  });
  return correlationsHashMap;
}
