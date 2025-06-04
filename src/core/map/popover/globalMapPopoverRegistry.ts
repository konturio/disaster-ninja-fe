import { MapPopoverContentRegistry } from './MapPopoverContentRegistry';

/**
 * Global singleton registry for map popover content providers.
 * Used by renderers to register their interaction providers.
 *
 * This provides a centralized coordination point for all map popup/tooltip
 * interactions while maintaining separation of concerns - each renderer
 * manages its own provider lifecycle.
 */
export const mapPopoverRegistry = new MapPopoverContentRegistry();
