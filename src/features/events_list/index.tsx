import { useAtom } from '@reatom/react';
import { currentEventAtom } from '~core/shared_state';
import { eventListResourceAtom } from './atoms/eventListResource';
import { EventsListPanel } from './components';

export function EventList() {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const [eventListResource] = useAtom(eventListResourceAtom);

  return (
    <EventsListPanel
      current={currentEvent?.id ?? null}
      error={eventListResource.error}
      loading={eventListResource.loading}
      eventsList={eventListResource.data}
      onCurrentChange={(id) => currentEventActions.setCurrentEventId(id)}
    />
  );
}
