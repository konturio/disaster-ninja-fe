import { Text } from '@konturio/ui-kit';
import s from './style.module.css';

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
        <Text type={'caption'} className={s.label}>
          {`${left.label} `}
        </Text>
      </span>{' '}
      <Text type={'caption'}>({left.value})</Text>
      {' \u2192 '}
      {/* Right */}
      <span style={{ color: right.color }}>
        <Text type={'caption'} className={s.label}>
          {`${right.label} `}
        </Text>
      </span>
      <Text type={'caption'}>({right.value})</Text>
      {units ? (
        <Text type={'caption'} className={s.unit}>
          , {units}
        </Text>
      ) : null}
    </div>
  );
}
