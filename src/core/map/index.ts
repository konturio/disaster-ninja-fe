import { KONTUR_DEBUG } from '~utils/debug';
import { DebugMapPopoverProvider } from './popover/DebugMapPopoverProvider';
import { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';

export type * from './types';

export { useMapPositionTracker } from './hooks/useMapPositionTracker';
export { useMapClickHandler } from './hooks/useMapClickHandler';
export { useMapPopoverIntegration } from './hooks/useMapPopoverIntegration';
export { useMapPopoverPriorityIntegration } from './hooks/useMapPopoverPriorityIntegration';
export { DefaultMapPopoverPositionCalculator } from './popover/MapPopoverPositionCalculator';
export { MapPopoverController } from './popover/MapPopoverController';
export { MapPopoverProvider, useMapPopoverService } from './popover/MapPopoverProvider';
export { MapPopoverContentRegistry } from './popover/MapPopoverContentRegistry';
export { mapPopoverRegistry } from './popover/globalMapPopoverRegistry';
export { DebugMapPopoverProvider } from './popover/DebugMapPopoverProvider';

// Register debug provider if debug mode is enabled
if (KONTUR_DEBUG) {
  const debugProvider = new DebugMapPopoverProvider();
  mapPopoverRegistry.register(debugProvider);
  console.info('Map popover debug provider registered');
}
