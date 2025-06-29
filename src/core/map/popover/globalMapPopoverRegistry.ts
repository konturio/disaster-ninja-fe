import { MapPopoverContentRegistry } from './MapPopoverContentRegistry';

/**
 * Global singleton registry for map popover content providers.
 * Used by renderers to register their interaction providers.
 *
 * This provides a centralized coordination point for all map popup/tooltip
 * interactions while maintaining separation of concerns - each renderer
 * manages its own provider lifecycle.
 *
 * Storing the instance on globalThis keeps it truly singleton across HMR reloads
 */
const g = globalThis as any;
export const mapPopoverRegistry: MapPopoverContentRegistry =
  g.__kontur_mapPopoverRegistry ??
  (g.__kontur_mapPopoverRegistry = new MapPopoverContentRegistry());
