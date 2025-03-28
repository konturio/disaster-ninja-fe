import { Text } from '@konturio/ui-kit';

export type Sentiment = {
  label: string;
  color: string;
  value: string;
};

export function Sentiments({
  left,
  right,
  units,
}: {
  left: Sentiment;
  right: Sentiment;
  units?: string | null;
}) {
  return (
    <div>
      {/* Left */}
      <span style={{ color: left.color }}>
        <Text type={'caption'}>{`${left.label} `}</Text>
      </span>{' '}
      <Text type={'caption'}>({+parseFloat(left.value).toFixed(3)})</Text>
      {' \u2192 '}
      {/* Right */}
      <span style={{ color: right.color }}>
        <Text type={'caption'}>{`${right.label} `}</Text>
      </span>
      <Text type={'caption'}>({+parseFloat(right.value).toFixed(3)})</Text>
      {units ? <Text type={'caption'}>, {units}</Text> : null}
    </div>
  );
}
