import { Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import errorImage from './error-state-img.png';
import s from './ErrorMessage.module.css';

export function ErrorMessage({
  message,
  marginTop = '30%',
}: {
  message?: string;
  marginTop?: string;
}) {
  return (
    <div className={s.spinner} style={{ marginTop }}>
      <Text type="short-l">{message ?? i18n.t('errors.default')}</Text>
      <img src={errorImage} alt="" className={s.icon} />
    </div>
  );
}
