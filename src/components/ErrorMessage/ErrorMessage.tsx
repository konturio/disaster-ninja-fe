import { Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import s from './ErrorMessage.module.css';

export function ErrorMessage({
  message,
  margin = '32px 16px',
}: {
  message?: string;
  marginTop?: string;
  margin?: string;
}) {
  return (
    <div className={s.spinner} style={{ margin }}>
      <Text type="short-l">{message ?? i18n.t('errors.default')}</Text>
    </div>
  );
}
