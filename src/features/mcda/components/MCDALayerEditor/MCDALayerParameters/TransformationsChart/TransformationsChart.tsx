import { useMemo } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { scaleSymlog } from 'd3-scale';
import { generateHclGradientColors } from '~features/mcda/utils/generateHclGradientColors';

const CHART_GREEN = 'rgb(50, 170, 100)';
const CHART_RED = 'rgb(228, 26, 28)';
const CHART_YELLOW = 'rgb(251,237,170)';
const COLOR_ORIGINAL = '#CCC';

type TransformationsChartProps = {
  transformedPoints?: number[];
  originalPoints?: number[];
};

function TransformationsChart({
  transformedPoints,
  originalPoints,
}: TransformationsChartProps) {
  const data = useMemo(
    () =>
      originalPoints?.map((value, index) => ({
        transformed: transformedPoints?.[index],
        original: value,
        x: index,
      })),
    [originalPoints, transformedPoints],
  );
  const scale = scaleSymlog([transformedPoints?.at(0), transformedPoints?.at(-1)]);

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
      <XAxis dataKey={'x'} tickSize={undefined} tickCount={2} />
      <YAxis dataKey="transformed" yAxisId="transformed" />
      <YAxis
        dataKey="original"
        scale={scale}
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
      />
      <Line
        type="monotone"
        dataKey="transformed"
        stroke={CHART_GREEN}
        yAxisId="transformed"
        dot={<GradientDot />}
      />
    </LineChart>
  );
}

const gradient = generateHclGradientColors(CHART_RED, CHART_YELLOW, 50);
gradient.push(...generateHclGradientColors(CHART_YELLOW, CHART_GREEN, 51));

const GradientDot = (props) => {
  const { cx, cy, payload } = props;
  return <circle cx={cx} cy={cy} r={2} fill={gradient[payload.x]} />;
};

TransformationsChart.propTypes = {};

export default TransformationsChart;
