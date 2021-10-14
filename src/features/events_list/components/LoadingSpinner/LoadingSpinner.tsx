import { Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import s from './LoadingSpinner.module.css';

export function LoadingSpinner() {
  return (
    <div className={s.spinner}>
      <Text type="short-l">{i18n.t('Gathering data')}</Text>
      <img src="loading-state-img.png" alt="" className={s.icon} />
    </div>
  );
}
