import { useAction, useAtom } from '@reatom/react';
import { useCallback } from 'react';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import core from '~core/index';
import { eventListResourceAtom } from './atoms/eventListResource';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsListPanel } from './components';

export function EventList() {
  const [currentEvent, currentEventActions] = useAtom(core.sharedState.currentEventAtom);
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
      onCurrentChange={onCurrentChange}
    />
  );
}
