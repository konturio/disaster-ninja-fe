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
