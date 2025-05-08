import { useAtom } from '@reatom/npm-react';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import { UniLayout } from '~components/Uni/Layout/UniLayout';
import { eventCardLayoutTemplate } from '~features/events_list/components/EventsPanel/eventLayouts';

export const CurrentEvent = () => {
  const [{ data }] = useAtom(currentEventResourceAtom.v3atom);
  if (!data) return null;

  const currentEvent = { ...data, showEpisodesButton: false, active: true };

  return (
    <div className="knt-panel knt-current-event">
      <UniLayout data={currentEvent} layout={eventCardLayoutTemplate}></UniLayout>
    </div>
  );
};
