import { Text } from '@konturio/ui-kit';
import core from '~core/index';
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
      <Text type="short-l">
        {core.i18n.t(message ?? 'Sorry, we are having issues, which will be fixed soon')}
      </Text>
      <img src={errorImage} alt="" className={s.icon} />
    </div>
  );
}
