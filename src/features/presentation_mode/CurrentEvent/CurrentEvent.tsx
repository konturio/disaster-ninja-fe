import { useAtom } from '@reatom/npm-react';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { eventCardLayoutTemplate } from '~features/events_list/components/EventsPanel/eventLayouts';
import { UniLayout } from '~components/Uni/Layout/UniLayout';

export const CurrentEvent = () => {
  const [{ data: currentEvent }] = useAtom(currentEventResourceAtom.v3atom);

  if (!currentEvent) return null;

  return (
    <div className="knt-panel knt-current-event">
      <UniLayout data={currentEvent} layout={eventCardLayoutTemplate}></UniLayout>
    </div>
  );
};
