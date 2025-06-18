import { KONTUR_DEBUG } from '~utils/debug';
import { DebugMapPopoverProvider } from './popover/DebugMapPopoverProvider';
import { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';

export type * from './types';

export { useMapPopoverPriorityIntegration } from './hooks/useMapPopoverPriorityIntegration';
export { MapPopoverProvider, useMapPopoverService } from './popover/MapPopoverProvider';
export { MapPopoverContentRegistry } from './popover/MapPopoverContentRegistry';
export { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';

// Coordinate utilities
export {
  getMapContainerRect,
  projectGeographicToScreen,
  clampToContainerBounds,
  mapContainerToPageCoords,
  pageToMapContainerCoords,
  geographicToPageCoords,
  geographicToClampedContainerCoords,
  type MapContainerPoint,
  type PagePoint,
  type ProjectedPoint,
  type ClampConfig,
} from './utils/maplibreCoordinateUtils';

export { isValidLngLat, isValidLngLatArray } from './utils/coordinateValidation';

// Additional legacy exports for compatibility
export { DefaultMapPopoverPositionCalculator } from './popover/MapPopoverPositionCalculator';
export { useMapPopoverMaplibreIntegration } from './hooks/useMapPopoverMaplibreIntegration';

// Provider layer
export type { IMapProvider, IMap } from './providers/IMapProvider';
export { MapLibreProvider, MapLibreAdapter } from './providers/MapLibreProvider';

// Core hooks
export { useMapInstance } from './hooks/useMapInstance';
export { useMapEffect } from './hooks/useMapEffect';
export { useMapEvents } from './hooks/useMapEvents';
export { useMapLayers } from './hooks/useMapLayers';
export { useMapPositionTracking } from './hooks/useMapPositionTracking';
export type { MapEventHandler } from './hooks/useMapEvents';

// Plugin system
export type { MapPlugin } from './types';
export { createMapPopoverPlugin } from './plugins/MapPopoverPlugin';

// Application integration
export { useApplicationMap } from './hooks/useApplicationMap';

// Register debug provider if debug mode is enabled
if (KONTUR_DEBUG) {
  const debugProvider = new DebugMapPopoverProvider();
  mapPopoverRegistry.register('debug', debugProvider);
  console.info('Map popover debug provider registered');
}
