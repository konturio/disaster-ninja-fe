import { i18n } from '~core/localization';
import s from './DeselectControl.module.css';

export function DeselectControl({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button type="button" onClick={onClick} className={s.deselectControl} disabled={disabled}>
      {i18n.t('deselect')}
    </button>
  );
}
