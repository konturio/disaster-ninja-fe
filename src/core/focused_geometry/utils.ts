import type { FocusedGeometry } from './types';

export function getEventId(focusedGeometry: FocusedGeometry | null) {
  return focusedGeometry?.source?.type === 'event'
    ? focusedGeometry.source.meta.eventId
    : null;
}
