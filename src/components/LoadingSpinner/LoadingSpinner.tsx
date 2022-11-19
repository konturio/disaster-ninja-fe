import { Text } from '@konturio/ui-kit';
import core from '~core/index';
import { KonturSpinner } from './KonturSpinner';
import s from './LoadingSpinner.module.css';

export function LoadingSpinner({
  message = core.i18n.t('spinner_text'),
  marginTop = '30%',
}: {
  message?: string;
  marginTop?: string;
}) {
  return (
    <div className={s.spinner} style={{ marginTop: marginTop ?? 'inherit' }}>
      <Text type="short-l">{message}</Text>
      <div className={s.animationContainer}>
        <KonturSpinner />
      </div>
    </div>
  );
}
