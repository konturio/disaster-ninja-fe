import type { FocusedGeometry } from './types';
import type { Severity, EventType } from '~core/types';

/**
 * Internal helper to safely access meta properties from focused geometry source
 * Handles common pattern: focusedGeometry?.source?.type === X ? focusedGeometry.source.meta[Y] : null
 */
export function getSourceMetaProperty<T>(
  focusedGeometry: FocusedGeometry | null,
  sourceType: 'event' | 'boundaries' | 'episode',
  propertyName: string,
): T | null {
  return focusedGeometry?.source?.type === sourceType
    ? (focusedGeometry.source.meta[propertyName] as T)
    : null;
}

/**
 * Type guard for checking if focused geometry is an event
 * Handles pattern: focusedGeometry?.source?.type === 'event'
 */
export function isEventGeometry(focusedGeometry: FocusedGeometry | null): boolean {
  return focusedGeometry?.source?.type === 'event';
}

/**
 * Type guard for checking if focused geometry is a boundary
 * Handles pattern: focusedGeometry?.source?.type === 'boundaries'
 */
export function isBoundaryGeometry(focusedGeometry: FocusedGeometry | null): boolean {
  return focusedGeometry?.source?.type === 'boundaries';
}

/**
 * Type guard for checking if focused geometry is an episode
 * Handles pattern: focusedGeometry?.source?.type === 'episode'
 */
export function isEpisodeGeometry(focusedGeometry: FocusedGeometry | null): boolean {
  return focusedGeometry?.source?.type === 'episode';
}

/**
 * Safely get event name from focused geometry
 * Handles pattern: focusedGeometry?.source?.type === 'event' ? focusedGeometry.source.meta.eventName : null
 */
export function getEventName(focusedGeometry: FocusedGeometry | null): string | null {
  return getSourceMetaProperty(focusedGeometry, 'event', 'eventName');
}

/**
 * Safely get event type from focused geometry
 * Handles pattern: focusedGeometry?.source?.type === 'event' ? focusedGeometry.source.meta.eventType : null
 */
export function getEventType(focusedGeometry: FocusedGeometry | null): EventType | null {
  return getSourceMetaProperty<EventType>(focusedGeometry, 'event', 'eventType');
}

/**
 * Safely get event severity from focused geometry
 * Handles pattern: focusedGeometry?.source?.type === 'event' ? focusedGeometry.source.meta.severity : null
 */
export function getEventSeverity(
  focusedGeometry: FocusedGeometry | null,
): Severity | null {
  return getSourceMetaProperty<Severity>(focusedGeometry, 'event', 'severity');
}

/**
 * Safely get boundary name from focused geometry
 * Handles pattern: focusedGeometry?.source?.type === 'boundaries' ? focusedGeometry.source.meta.name : null
 */
export function getBoundaryName(focusedGeometry: FocusedGeometry | null): string | null {
  return getSourceMetaProperty(focusedGeometry, 'boundaries', 'name');
}

/**
 * Safely get event ID from focused geometry
 * Handles pattern: focusedGeometry?.source?.type === 'event' ? focusedGeometry.source.meta.eventId : null
 */
export function getEventId(focusedGeometry: FocusedGeometry | null): string | null {
  return getSourceMetaProperty(focusedGeometry, 'event', 'eventId');
}
