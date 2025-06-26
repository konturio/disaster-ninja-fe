import React, { useCallback, useEffect, useState } from 'react';
import { Map as MapLibreMap, type MapOptions as MapLibreOptions } from 'maplibre-gl';
import { throttle } from '~utils/common';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapOptions {
  getConfig: () => Omit<MapLibreOptions, 'container'>;
  onMapCreated?: (map: MapLibreMap) => void;
  onMapDestroy?: (map: MapLibreMap) => void;
  /** Auto-resize map on container resize. Default: true. Set to false to disable */
  autoResize?: boolean;
}

/**
 * MapLibre container component that manages map instance lifecycle.
 *
 * Uses render prop pattern - children receive the map instance as parameter.
 * This eliminates the need for child components to depend on [map] in useEffect
 * dependencies, as the map is passed directly through the render function.
 *
 * The component handles:
 * - Map creation and cleanup
 * - Auto-resize functionality with ResizeObserver
 * - Proper cleanup of event listeners and observers
 *
 * @example
 * ```tsx
 * <MapLibreContainer options={mapOptions} className="my-map">
 *   {(map) => (
 *     <MyMapComponent map={map} />
 *   )}
 * </MapLibreContainer>
 * ```
 */
export function MapLibreContainer({
  options,
  children,
  className,
}: {
  options: MapOptions;
  children: (map: MapLibreMap) => React.ReactNode;
  className?: string;
}) {
  const [mapInstance, setMapInstance] = useState<MapLibreMap | null>(null);

  const handleRef = useCallback((node: HTMLDivElement | null) => {
    if (node && !mapInstance) {
      const config = options.getConfig();
      const map = new MapLibreMap({
        container: node,
        ...config,
      });

      // Fix for React dev tools
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).toJSON = () => '[MapLibreMap Object]';

      let resizeCleanup: (() => void) | undefined;

      const autoResize = options.autoResize ?? true;
      if (autoResize) {
        const throttledResize = throttle(() => {
          map.getCanvas().style.width = '100%';
          map.getCanvas().style.height = '100%';
          map.resize();
        }, 100);

        const resizeObserver = new ResizeObserver(throttledResize);
        resizeObserver.observe(map.getContainer());

        // Initial resize for layout stability
        requestAnimationFrame(() => map.resize());

        resizeCleanup = () => {
          resizeObserver.disconnect();
          throttledResize.cancel?.();
        };
      }

      // Store cleanup function
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any)._resizeCleanup = resizeCleanup;

      options.onMapCreated?.(map);
      setMapInstance(map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (mapInstance) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resizeCleanup = (mapInstance as any)._resizeCleanup;
        if (resizeCleanup && typeof resizeCleanup === 'function') {
          resizeCleanup();
        }

        options.onMapDestroy?.(mapInstance);
        mapInstance.remove();
        setMapInstance(null);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  return (
    <div ref={handleRef} className={className}>
      {mapInstance && children(mapInstance)}
    </div>
  );
}
