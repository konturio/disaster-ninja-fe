import { createAtom } from '@reatom/core';

type CurrentEventAtomState = {
  id: string;
} | null;

export const currentEventAtom = createAtom(
  {
    setCurrentEventId: (eventId: string) => eventId,
    resetCurrentEvent: () => null,
  },
  ({ onAction }, state: CurrentEventAtomState = null) => {
    onAction('setCurrentEventId', (eventId) => (state = { id: eventId }));
    onAction('resetCurrentEvent', () => (state = null));
    return state;
  },
);
