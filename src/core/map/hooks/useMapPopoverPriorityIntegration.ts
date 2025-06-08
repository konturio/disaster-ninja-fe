import { useEffect, useRef } from 'react';
import { registerMapListener } from '~core/shared_state/mapListeners';
import { useMapPopoverMaplibreIntegration } from './useMapPopoverMaplibreIntegration';
import type { UseMapPopoverMaplibreIntegrationOptions } from './useMapPopoverMaplibreIntegration';
import type { MapMouseEvent } from 'maplibre-gl';

export interface UseMapPopoverPriorityIntegrationOptions
  extends Omit<UseMapPopoverMaplibreIntegrationOptions, 'enabled'> {
  priority?: number;
  enabled?: boolean;
}

/**
 * Specialized hook for ConnectedMap that integrates popover with priority system.
 * Reuses useMapPopoverMaplibreIntegration to eliminate duplication while working with
 * the existing priority-based event coordination.
 */
export function useMapPopoverPriorityIntegration(
  options: UseMapPopoverPriorityIntegrationOptions,
) {
  const { priority = 55, enabled = true, ...integrationOptions } = options;

  // Use the main integration hook but disable its direct click binding
  const { handleMapClick, close } = useMapPopoverMaplibreIntegration({
    ...integrationOptions,
    enabled: false,
  });

  const mapRef = useRef(options.map);
  const enabledRef = useRef(enabled);
  const handleMapClickRef = useRef(handleMapClick);

  mapRef.current = options.map;
  enabledRef.current = enabled;
  handleMapClickRef.current = handleMapClick;

  useEffect(() => {
    const currentMap = mapRef.current;
    if (!currentMap) return;

    const mapPopoverClickListener = (event: MapMouseEvent) => {
      const currentEnabled = enabledRef.current;
      const currentHandler = handleMapClickRef.current;

      if (currentEnabled && currentHandler) {
        currentHandler(event);
      }
      return true; // Always non-blocking in priority system
    };

    const unregister = registerMapListener('click', mapPopoverClickListener, priority);

    return () => {
      unregister();
      close();
    };
  }, [priority, options.map]);

  return { close };
}
