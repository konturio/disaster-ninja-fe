import { useAtom } from '@reatom/react';
import { currentEventAtom } from '~core/shared_state';
import { AppFeature } from '~core/auth/types';
import { eventListResourceAtom } from './atoms/eventListResource';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsListPanel } from './components';
import type { FeatureInterface } from '~utils/hooks/useAppFeature';

function EventList({ reportReady }: { reportReady: () => void }) {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const [eventListResource] = useAtom(eventListResourceAtom);
  useAtom(autoSelectEvent);

  return (
    <EventsListPanel
      current={currentEvent?.id ?? null}
      error={eventListResource.error}
      loading={eventListResource.loading}
      eventsList={eventListResource.data}
      onCurrentChange={(id) => currentEventActions.setCurrentEventId(id)}
      reportReady={reportReady}
    />
  );
}

export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.EVENTS_LIST,
  RootComponent: EventList,
};
