import { Text } from '@konturio/ui-kit';
import clsx from 'clsx';
import { i18n } from '~core/localization';
import s from './ErrorMessage.module.css';

export function ErrorMessage({
  message,
  containerClass,
}: {
  message?: string;
  containerClass?: string;
}) {
  return (
    <div className={clsx(s.errorContainer, containerClass)}>
      <Text type="short-l">{message ?? i18n.t('errors.default')}</Text>
    </div>
  );
}
