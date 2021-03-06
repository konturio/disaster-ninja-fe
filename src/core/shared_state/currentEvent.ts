import { createAtom, createBooleanAtom } from '~utils/atoms';
import { focusedGeometryAtom } from './focusedGeometry';
import { currentEventFeedAtom } from './currentEventFeed';

// * CurrentEventAtomState *
// null represents the initial state of event - we need that state for cases of autoselecting event
// { id: null } represents event reset was caused by user actions
export type CurrentEventAtomState = {
  id: string | null;
} | null;

export const currentEventAtom = createAtom(
  {
    setCurrentEventId: (eventId: string | null) => eventId,
    resetCurrentEvent: () => null,
    focusedGeometryAtom,
    currentEventFeedAtom,
  },
  ({ onAction, onChange }, state: CurrentEventAtomState = null) => {
    onChange('focusedGeometryAtom', (focusedGeometry) => {
      const currentGeometrySource = focusedGeometry?.source;
      if (currentGeometrySource && currentGeometrySource.type !== 'event') {
        // if focused geometry is no longer represents event, user stopped work with events
        // following state specifies that
        state = { id: null };
      }
    });

    onAction('setCurrentEventId', (eventId) => (state = { id: eventId }));
    onAction('resetCurrentEvent', () => (state = null));
    return state;
  },
  '[Shared state] currentEventAtom',
);

export const scheduledAutoSelect = createBooleanAtom(false);
export const scheduledAutoFocus = createBooleanAtom(false);
