import TransformationsChart from '../TransformationsChart/TransformationsChart';
import s from './MCDATransformationDebugInfo.module.css';
import type { TransformationFunction } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { AxisTransformationWithPoints } from '~utils/bivariate';

type Props = {
  transformationsStatistics: Map<
    TransformationFunction,
    AxisTransformationWithPoints
  > | null;
  selectedTransformationFunction: TransformationFunction;
};

export default function MCDATransformationDebugInfo({
  transformationsStatistics,
  selectedTransformationFunction,
}: Props) {
  return (
    <div className={s.debugInfoContainer}>
      <div className={s.debugText}>
        skew: {transformationsStatistics?.get(selectedTransformationFunction)?.skew}
      </div>
      <div className={s.debugText}>
        mean: {transformationsStatistics?.get(selectedTransformationFunction)?.mean}
      </div>
      <div className={s.debugText}>
        sdev: {transformationsStatistics?.get(selectedTransformationFunction)?.stddev}
      </div>
      <div className={s.debugText}>
        lbnd: {transformationsStatistics?.get(selectedTransformationFunction)?.lowerBound}
      </div>
      <div className={s.debugText}>
        ubnd: {transformationsStatistics?.get(selectedTransformationFunction)?.upperBound}
      </div>

      <div className={s.chartContainer}>
        <TransformationsChart
          transformedData={transformationsStatistics?.get(selectedTransformationFunction)}
          originalData={transformationsStatistics?.get('no')}
        />
      </div>
    </div>
  );
}
