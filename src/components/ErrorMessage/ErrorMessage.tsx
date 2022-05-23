import { Text } from '@k2-packages/ui-kit';
import { TranslationService as i18n } from '~core/localization';
import s from './ErrorMessage.module.css';

export function ErrorMessage({ message }) {
  return (
    <div className={s.spinner}>
      <Text type="short-l">
        {i18n.t(message || 'Sorry, we are having issues, which will be fixed soon')}
      </Text>
      <img src="assets/error-state-img.png" alt="" className={s.icon} />
    </div>
  );
}
