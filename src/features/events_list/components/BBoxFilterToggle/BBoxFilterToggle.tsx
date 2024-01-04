import { Button } from '@konturio/ui-kit';
import { CloseFilled16, Update16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react-v2';
import { i18n } from '~core/localization';
import { featureFlagsAtom, FeatureFlag } from '~core/shared_state';
import { eventListFilters } from '../../atoms/eventListFilters';
import s from './BBoxFilterToggle.module.css';

export function BBoxFilterToggle() {
  const [featureFlags] = useAtom(featureFlagsAtom);
  const [bbox, { setBBoxFilterFromCurrentMapView, resetBboxFilter }] = useAtom(
    eventListFilters,
    (filters) => filters.bbox,
    [],
  );
  const isActive = bbox !== null;
  return featureFlags[FeatureFlag.EVENTS_LIST__BBOX_FILTER] ? (
    <div className={s.bBoxFilterToggle}>
      <Button
        variant="invert-outline"
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
  ) : null;
}
