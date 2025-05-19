import { Button } from '@konturio/ui-kit';
import { CloseFilled16, Update16 } from '@konturio/default-icons';
import { i18n } from '~core/localization';
import s from './BBoxFilterToggle.module.css';

export function BBoxFilterToggle({
  currentFilter,
  onCleanFilter,
  onSetFilter,
}: {
  currentFilter: object | null;
  onCleanFilter: () => void;
  onSetFilter: () => void;
}) {
  const isActive = currentFilter !== null;
  return (
    <div className={s.bBoxFilterToggle}>
      <Button
        variant="invert-outline"
        className="knt-panel-button"
        size="small"
        active={isActive}
        onClick={isActive ? onCleanFilter : onSetFilter}
        iconAfter={isActive ? <CloseFilled16 /> : null}
      >
        {i18n.t('event_list.bbox_filter_button')}
      </Button>
      {isActive && (
        <Button
          variant="invert-outline"
          size="small"
          onClick={onSetFilter}
          iconAfter={<Update16 />}
        ></Button>
      )}
    </div>
  );
}
