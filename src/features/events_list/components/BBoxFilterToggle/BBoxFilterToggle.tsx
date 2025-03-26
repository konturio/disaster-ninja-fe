import { Button } from '@konturio/ui-kit';
import { CloseFilled16, Update16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { eventListFilters } from '../../atoms/eventListFilters';
import s from './BBoxFilterToggle.module.css';

// AppFeature: EVENTS_LIST__BBOX_FILTER
export function BBoxFilterToggle() {
  const [bbox, { setBBoxFilterFromCurrentMapView, resetBboxFilter }] = useAtom(
    eventListFilters,
    (filters) => filters.bbox,
    [],
  );
  const isActive = bbox !== null;
  return (
    <div className={s.bBoxFilterToggle}>
      <Button
        variant="invert-outline"
        className="knt-panel-button"
        size="small"
        active={isActive}
        onClick={isActive ? resetBboxFilter : setBBoxFilterFromCurrentMapView}
        iconAfter={isActive ? <CloseFilled16 /> : null}
      >
        {i18n.t('event_list.bbox_filter_button')}
      </Button>
      {isActive && (
        <Button
          variant="invert-outline"
          size="small"
          onClick={setBBoxFilterFromCurrentMapView}
          iconAfter={<Update16 />}
        ></Button>
      )}
    </div>
  );
}
