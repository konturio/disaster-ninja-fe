import { useEffect, useRef } from 'react';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { useMapPopoverIntegration } from './useMapPopoverIntegration';
import type { UseMapPopoverIntegrationOptions } from './useMapPopoverIntegration';
import type { Map, MapMouseEvent } from 'maplibre-gl';

export interface UseMapPopoverPriorityIntegrationOptions
  extends Omit<UseMapPopoverIntegrationOptions, 'enabled'> {
  priority?: number;
  enabled?: boolean;
}

/**
 * Specialized hook for ConnectedMap that integrates popover with priority system.
 * Reuses useMapPopoverIntegration to eliminate duplication while working with
 * the existing priority-based event coordination.
 */
export function useMapPopoverPriorityIntegration(
  options: UseMapPopoverPriorityIntegrationOptions,
) {
  const { priority = 55, enabled = true, ...integrationOptions } = options;

  // Use the main integration hook but disable its direct click binding
  const { handleMapClick, close } = useMapPopoverIntegration({
    ...integrationOptions,
    enabled: false, // Disable direct binding, we'll use priority system
  });

  // Store values in refs to avoid useEffect dependency hell
  const mapRef = useRef(options.map);
  const enabledRef = useRef(enabled);
  const handleMapClickRef = useRef(handleMapClick);
  const closeRef = useRef(close);

  // Update refs when values change
  mapRef.current = options.map;
  enabledRef.current = enabled;
  handleMapClickRef.current = handleMapClick;
  closeRef.current = close;

  // Register with priority system using stable dependencies
  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    const mapPopoverClickListener = (event: MapMouseEvent) => {
      const currentEnabled = enabledRef.current;
      const currentHandler = handleMapClickRef.current;

      if (currentEnabled && currentHandler) {
        const actualHandler = currentHandler(); // Call the getter function
        if (actualHandler) {
          actualHandler(event);
        }
      }
      return true; // Always non-blocking in priority system
    };

    const unregister = registerMapListener('click', mapPopoverClickListener, priority);

    return () => {
      unregister();
      const currentClose = closeRef.current;
      if (currentClose) {
        currentClose();
      }
    };
  }, [priority, options.map]); // Depend on both priority and map instance

  return { close };
}
