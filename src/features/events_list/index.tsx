import { useAction, useAtom } from '@reatom/react';
import { useCallback } from 'react';
import { currentEventAtom } from '~core/shared_state';
import { AppFeature } from '~core/auth/types';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { eventListResourceAtom } from './atoms/eventListResource';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsListPanel } from './components';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

function EventList({ reportReady }: { reportReady: () => void }) {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const [eventListResource] = useAtom(eventListResourceAtom);
  const scheduleAutoFocus = useAction(scheduledAutoFocus.setTrue);
  const onCurrentChange = useCallback((id: string) => {
    currentEventActions.setCurrentEventId(id);
    scheduleAutoFocus();
  }, []);

  useAtom(autoSelectEvent);

  return (
    <EventsListPanel
      current={currentEvent?.id ?? null}
      error={eventListResource.error}
      loading={eventListResource.loading}
      eventsList={eventListResource.data}
      reportReady={reportReady}
      onCurrentChange={onCurrentChange}
    />
  );
}

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.EVENTS_LIST,
  rootComponentWrap(reportReady, addedProps) {
    return () => <EventList reportReady={reportReady} />;
  },
};
