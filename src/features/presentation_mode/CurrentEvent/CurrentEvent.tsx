import { useAtom } from '@reatom/npm-react';
import { currentEventResourceAtom } from '~core/shared_state/currentEventResource';
import {
  useUniLayoutContextValue,
  UniLayoutContext,
} from '~components/Uni/Layout/UniLayoutContext';
import { eventCardLayoutTemplate } from '~features/events_list/components/EventsPanel/eventLayouts';
import { UniLayout } from '~components/Uni/Layout/UniLayout';

export const CurrentEvent = () => {
  const [{ data: currentEvent }] = useAtom(currentEventResourceAtom.v3atom);

  const layoutContextValue = useUniLayoutContextValue({
    layout: eventCardLayoutTemplate,
  });

  if (!currentEvent) return null;

  return (
    <div className="knt-panel knt-current-event" style={{ zoom: 1.4 }}>
      <UniLayout data={currentEvent} layout={eventCardLayoutTemplate}></UniLayout>
    </div>
  );
};
