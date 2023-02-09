import { useAction, useAtom } from '@reatom/react';
import { useCallback } from 'react';
import { currentEventAtom } from '~core/shared_state';
import { currentEventBbox } from '~features/events_list/atoms/currentEventBbox';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsPanel } from './components/EventsPanel/EventsPanel';

export function EventList() {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const fitBounds = useAction(currentEventBbox.fitBounds);
  const onCurrentChange = useCallback((id: string) => {
    currentEventActions.setCurrentEventId(id);
    fitBounds();
  }, []);

  useAtom(autoSelectEvent);
  return (
    <EventsPanel currentEventId={currentEvent?.id} onCurrentChange={onCurrentChange} />
  );
}
