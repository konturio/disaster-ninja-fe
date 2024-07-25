import { useMemo } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { generateHclGradientColors } from '~features/mcda/utils/generateHclGradientColors';

export const CHART_GREEN = 'rgb(50, 170, 100)';
export const CHART_RED = 'rgb(228, 26, 28)';
export const CHART_YELLOW = 'rgb(251,237,170)';

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
      <XAxis dataKey={'x'} tickSize={undefined} />
      <YAxis scale={'sqrt'} />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="original"
        stroke="#777777"
        dot={{ r: 1.5, fill: '#999999' }}
      />
      <Line
        animationDuration={500}
        type="monotone"
        dataKey="transformed"
        stroke={CHART_GREEN}
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
