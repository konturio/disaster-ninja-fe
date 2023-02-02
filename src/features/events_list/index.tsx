import { useAction, useAtom } from '@reatom/react';
import { useCallback } from 'react';
import { currentEventAtom } from '~core/shared_state';
import { scheduledAutoFocus } from '~core/shared_state/currentEvent';
import { currentEventBbox } from '~core/shared_state/currentEventBbox';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsPanel } from './components/EventsPanel/EventsPanel';

export function EventList() {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const [, bboxActions] = useAtom(currentEventBbox);
  const scheduleAutoFocus = useAction(scheduledAutoFocus.setTrue);
  const onCurrentChange = useCallback((id: string) => {
    currentEventActions.setCurrentEventId(id);
    bboxActions.fitBounds();
  }, []);

  useAtom(autoSelectEvent);
  return (
    <EventsPanel currentEventId={currentEvent?.id} onCurrentChange={onCurrentChange} />
  );
}
