import { TranslationService as i18n } from '~core/localization';
import s from './DeselectControl.module.css';

export function DeselectControl({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={s.deselectControl}>
      {i18n.t('Deselect')}
    </button>
  );
}
