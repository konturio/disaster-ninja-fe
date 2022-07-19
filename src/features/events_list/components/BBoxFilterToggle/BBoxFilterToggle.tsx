import { Button } from '@konturio/ui-kit';
import { CloseFilled16, Update16 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { i18n } from '~core/localization';
import { eventListFilters } from '../../atoms/eventListFilters';
import s from './BBoxFilterToggle.module.css';

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
        size="small"
        active={isActive}
        onClick={isActive ? resetBboxFilter : setBBoxFilterFromCurrentMapView}
        iconAfter={isActive ? <CloseFilled16 /> : null}
      >
        {i18n.t('Use map view as filter')}
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
