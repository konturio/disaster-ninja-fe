import { KONTUR_DEBUG } from '~utils/debug';
import { DebugMapPopoverProvider } from './popover/DebugMapPopoverProvider';
import { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';

export type * from './types';

// export { useMapPositionTracker } from './hooks/useMapPositionTracker';
// export { useMapPopoverMaplibreIntegration } from './hooks/useMapPopoverMaplibreIntegration';
export { useMapPopoverPriorityIntegration } from './hooks/useMapPopoverPriorityIntegration';
// export { DefaultMapPopoverPositionCalculator } from './popover/MapPopoverPositionCalculator';
export { MapPopoverProvider, useMapPopoverService } from './popover/MapPopoverProvider';
export { MapPopoverContentRegistry } from './popover/MapPopoverContentRegistry';
export { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';

// Coordinate utilities (new DRY-compliant utilities)
export {
  getMapContainerRect,
  projectGeographicToScreen,
  clampToContainerBounds,
  mapContainerToPageCoords,
  pageToMapContainerCoords,
  geographicToPageCoords,
  geographicToClampedContainerCoords,
  mapEventToPageCoords,
  type MapContainerPoint,
  type PagePoint,
  type ProjectedPoint,
  type ClampConfig,
} from './utils/maplibreCoordinateUtils';

export { isValidLngLat, isValidLngLatArray } from './utils/coordinateValidation';

// Register debug provider if debug mode is enabled
if (KONTUR_DEBUG) {
  const debugProvider = new DebugMapPopoverProvider();
  mapPopoverRegistry.register('debug', debugProvider);
  console.info('Map popover debug provider registered');
}

// Additional legacy exports for compatibility
export { DebugMapPopoverProvider } from './popover/DebugMapPopoverProvider';
export { DefaultMapPopoverPositionCalculator } from './popover/MapPopoverPositionCalculator';
export { useMapPopoverMaplibreIntegration } from './hooks/useMapPopoverMaplibreIntegration';

// New modular architecture exports
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
export type { MapPlugin } from './plugins/MapPlugin';
export { createMapPopoverPlugin } from './plugins/MapPopoverPlugin';

// Application integration
export { useApplicationMap } from './hooks/useApplicationMap';
