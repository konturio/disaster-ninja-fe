import { Text } from '@konturio/ui-kit';
import { mcdaRangeToFixedNumber } from '~utils/mcda/mcdaLegendsUtils';

export type Sentiment = {
  label: string;
  color: string;
  value: number | undefined;
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
      <Text type={'caption'}>({mcdaRangeToFixedNumber(left.value)})</Text>
      {' \u2192 '}
      {/* Right */}
      <span style={{ color: right.color }}>
        <Text type={'caption'}>{`${right.label} `}</Text>
      </span>
      <Text type={'caption'}>({mcdaRangeToFixedNumber(right.value)})</Text>
      {units ? <Text type={'caption'}>, {units}</Text> : null}
    </div>
  );
}
