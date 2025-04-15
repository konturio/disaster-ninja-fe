import { useAction, useAtom } from '@reatom/react-v2';
import { useAtom as useAtomV3 } from '@reatom/npm-react';
import { useCallback } from 'react';
import { currentEventAtom } from '~core/shared_state/currentEvent';
import { episodesPanelState } from '~core/shared_state/episodesPanelState';
import { currentEventBbox } from './atoms/currentEventBbox';
import { autoSelectEvent } from './atoms/autoSelectEvent';
import { EventsUniPanel } from './components/EventsPanel/EventsUniPanel';

export function EventList() {
  const [currentEvent, currentEventActions] = useAtom(currentEventAtom);
  const fitBounds = useAction(currentEventBbox.fitBounds);
  const [panelState, panelStateActions] = useAtom(episodesPanelState);
  const actionHandler = useCallback(
    (action: string, data?: { eventId: string }) => {
      switch (action) {
        case 'focusEvent':
          if (data?.eventId && data.eventId !== currentEvent?.id) {
            currentEventActions.setCurrentEventId(data.eventId);
          }
          fitBounds();
          break;
        case 'playEpisodes':
          if (panelState.isOpen) {
            panelStateActions.close();
          } else {
            panelStateActions.open();
          }
          break;
      }
    },
    [currentEvent?.id, panelState.isOpen],
  );

  useAtomV3(autoSelectEvent);
  return (
    <EventsUniPanel currentEventId={currentEvent?.id} actionHandler={actionHandler} />
  );
}
