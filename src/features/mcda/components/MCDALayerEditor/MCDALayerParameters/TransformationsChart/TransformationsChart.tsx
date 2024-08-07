import { useMemo } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { scaleSqrt, scaleSymlog } from 'd3-scale';
import { generateHclGradientColors } from '~features/mcda/utils/generateHclGradientColors';
import { inViewCalculations } from '~core/logical_layers/renderers/stylesConfigs/mcda/calculations';
import s from './TransformationsChart.module.css';
import type { TransformationFunction } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';
import type { AxisTransformationWithPoints } from '~utils/bivariate';

const CHART_GREEN = 'rgb(50, 170, 100)';
const CHART_RED = 'rgb(228, 26, 28)';
const CHART_YELLOW = 'rgb(251, 237, 170)';
const COLOR_ORIGINAL = '#CCC';

type TransformationsChartProps = {
  transformedData?: AxisTransformationWithPoints;
  originalData?: AxisTransformationWithPoints;
};

function getScaleFunction(
  transformationFunction: TransformationFunction | undefined,
  points: number[] | undefined,
) {
  switch (transformationFunction) {
    case 'log':
    case 'log_epsilon':
      return scaleSymlog([points?.at(0), points?.at(-1)]);
    case 'cube_root':
    case 'square_root':
      return scaleSqrt([points?.at(0), points?.at(-1)]);
    default:
      return 'auto';
  }
}

function TransformationsChart({
  transformedData,
  originalData,
}: TransformationsChartProps) {
  const isTransformationApplied = useMemo(
    () => transformedData?.transformation !== 'no',
    [transformedData],
  );

  const clampedTransformedPoints = useMemo(
    () =>
      isTransformationApplied
        ? transformedData?.points?.map((point) =>
            inViewCalculations.clamp(
              point,
              transformedData.lowerBound,
              transformedData.upperBound,
            ),
          )
        : transformedData?.points,
    [isTransformationApplied, transformedData],
  );

  const data = useMemo(
    () =>
      originalData?.points?.map((value, index) => ({
        transformed: clampedTransformedPoints?.[index],
        original: value,
        x: index,
      })),
    [clampedTransformedPoints, originalData?.points],
  );
  const scaleTransformed = useMemo(
    () => getScaleFunction('no', clampedTransformedPoints),
    [clampedTransformedPoints],
  );
  const scaleOriginal = useMemo(
    () => getScaleFunction(transformedData?.transformation, originalData?.points),
    [originalData?.points, transformedData?.transformation],
  );

  return (
    <LineChart
      width={400}
      height={300}
      data={data}
      style={{ marginLeft: '-150px' }}
      margin={{
        top: 5,
        right: 30,
        left: 30,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        className={s.transformationChart}
        dataKey={'x'}
        ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90]}
        name="percentile"
        label={{ value: 'Percentiles', position: 'insideBottomRight', offset: 0 }}
      />
      <YAxis dataKey="transformed" yAxisId="transformed" scale={scaleTransformed} />
      <YAxis
        dataKey="original"
        scale={scaleOriginal}
        orientation="right"
        yAxisId="original"
        axisLine={{ stroke: COLOR_ORIGINAL }}
        tickLine={{ stroke: COLOR_ORIGINAL }}
        tick={{ fill: COLOR_ORIGINAL }}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="original"
        stroke={COLOR_ORIGINAL}
        yAxisId="original"
        dot={{ r: 1.5, fill: COLOR_ORIGINAL }}
        strokeWidth={0.25}
        animationDuration={700}
      />
      <Line
        type="monotone"
        dataKey="transformed"
        stroke={CHART_GREEN}
        yAxisId="transformed"
        dot={<GradientDot />}
        strokeWidth={0.25}
        animationDuration={700}
      />
    </LineChart>
  );
}

const gradient = generateHclGradientColors(CHART_RED, CHART_YELLOW, 50);
gradient.push(...generateHclGradientColors(CHART_YELLOW, CHART_GREEN, 51));

const GradientDot = (props) => {
  const { cx, cy, payload } = props;
  return <circle cx={cx} cy={cy} r={1.5} fill={gradient[payload.x]} />;
};

export default TransformationsChart;
