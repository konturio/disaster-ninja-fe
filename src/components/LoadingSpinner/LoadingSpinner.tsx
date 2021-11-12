import { Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import { KonturSpinner } from './KonturSpinner';
import s from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={s.spinner}>
      <Text type="short-l">{i18n.t('Gathering data')}</Text>
      <div className={s.animationContainer}>
        <KonturSpinner />
      </div>
    </div>
  );
}
