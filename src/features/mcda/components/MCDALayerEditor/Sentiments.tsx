import { Text } from '@konturio/ui-kit';
import s from './style.module.css';

type Sentiment = {
  label: string;
  color: string;
  value: string;
};

export function Sentiments({
  right,
  left,
  units,
}: {
  right: Sentiment;
  left: Sentiment;
  units?: string | null;
}) {
  return (
    <div>
      {/* Right */}
      <span style={{ color: right.color }}>
        <Text type={'caption'} className={s.label}>
          {`${right.label} `}
        </Text>
      </span>{' '}
      <Text type={'caption'}>({right.value})</Text>
      {' \u2192 '}
      {/* Left */}
      <span style={{ color: left.color }}>
        <Text type={'caption'} className={s.label}>
          {`${left.label} `}
        </Text>
      </span>
      <Text type={'caption'}>({left.value})</Text>
      {units ? (
        <Text type={'caption'} className={s.unit}>
          , {units}
        </Text>
      ) : null}
    </div>
  );
}
