import { Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import { KonturSpinner } from './KonturSpinner';
import s from './LoadingSpinner.module.css';

export function LoadingSpinner({
  message = i18n.t('spinner_text'),
  marginTop = '30%',
}: {
  message?: string | null;
  marginTop?: string;
}) {
  return (
    <div className={s.spinner} style={{ marginTop: marginTop ?? 'inherit' }}>
      {message && <Text type="short-l">{message}</Text>}
      <div className={s.animationContainer}>
        <KonturSpinner />
      </div>
    </div>
  );
}

export function FullScreenLoader() {
  return (
    <div className={s.fullScreenLoader}>
      <LoadingSpinner message={null} marginTop={'none'} />
    </div>
  );
}
