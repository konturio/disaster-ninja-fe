import core from '~core/index';
import s from './DeselectControl.module.css';

export function DeselectControl({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className={s.deselectControl}>
      {core.i18n.t('deselect')}
    </button>
  );
}
