import { createAtom } from '~utils/atoms';
import { focusedGeometryAtom } from './focusedGeometry';

export type CurrentEventAtomState = {
  id: string;
} | null;

export const currentEventAtom = createAtom(
  {
    setCurrentEventId: (eventId: string) => eventId,
    resetCurrentEvent: () => null,
    focusedGeometryAtom,
  },
  ({ onAction, onChange }, state: CurrentEventAtomState = null) => {
    onAction('setCurrentEventId', (eventId) => (state = { id: eventId }));
    onAction('resetCurrentEvent', () => (state = null));
    onChange('focusedGeometryAtom', (focusedGeometry) => {
      const currentGeometrySource = focusedGeometry?.source;
      if (currentGeometrySource && currentGeometrySource.type !== 'event') {
        state = null;
      }
    });
    return state;
  },
  '[Shared state] currentEventAtom',
);
