import { useAtom } from '@reatom/npm-react';
import { EventCard } from '~features/events_list/components/EventCard/EventCard';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';

export const CurrentEvent = () => {
  const [{ data: currentEvent }] = useAtom(currentEventResourceAtom.v3atom);
  if (!currentEvent) return null;

  return (
    <div className="knt-panel">
      <EventCard
        key={currentEvent.eventId}
        event={currentEvent}
        isActive={false}
        externalUrls={currentEvent?.externalUrls}
        showDescription={true}
      />
    </div>
  );
};
