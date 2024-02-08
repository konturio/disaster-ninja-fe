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
      <Text type={'caption'} className={s.label}>
        {right.label}
      </Text>{' '}
      <Text type={'caption'}>({right.value})</Text>
      {' 🠒 '}
      <Text type={'caption'} className={s.label}>
        {left.label}
      </Text>{' '}
      <Text type={'caption'}>({left.value})</Text>
      {units ? (
        <Text type={'caption'} className={s.unit}>
          , {units}
        </Text>
      ) : null}
    </div>
  );
}
