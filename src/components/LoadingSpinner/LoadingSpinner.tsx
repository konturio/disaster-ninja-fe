import { Text } from '@konturio/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { KonturSpinner } from './KonturSpinner';
import s from './LoadingSpinner.module.css';

export function LoadingSpinner({
  message = i18n.t('Gathering data'),
}: {
  message?: string;
}) {
  return (
    <div className={s.spinner}>
      <Text type="short-l">{message}</Text>
      <div className={s.animationContainer}>
        <KonturSpinner />
      </div>
    </div>
  );
}
