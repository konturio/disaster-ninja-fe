import { createAtom } from '@reatom/core';

type CurrentEventAtomState = {
  id: string;
} | null;

export const currentEventAtom = createAtom(
  {
    setCurrentEventId: (eventId: string) => eventId,
    unsetCurrentEvent: () => null,
  },
  ({ onAction }, state: CurrentEventAtomState = null) => {
    onAction('setCurrentEventId', (eventId) => (state = { id: eventId }));
    onAction('unsetCurrentEvent', () => (state = null));
    return state;
  },
);
