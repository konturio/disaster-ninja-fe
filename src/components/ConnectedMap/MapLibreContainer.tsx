import React, { useCallback, useEffect, useState } from 'react';
import { Map as MapLibreMap, type MapOptions as MapLibreOptions } from 'maplibre-gl';
import { throttle } from '~utils/common';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapOptions {
  getConfig: () => Omit<MapLibreOptions, 'container'>;
  onMapCreated?: (map: MapLibreMap) => void;
  onMapDestroy?: (map: MapLibreMap) => void;
  /** Auto-resize handling. Default: true. Set to false to disable */
  autoResize?: boolean;
}

export function MapLibreContainer({
  options,
  children,
}: {
  options: MapOptions;
  children: (map: MapLibreMap) => React.ReactNode;
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
      (map as any).toJSON = () => '[MapLibreMap Object]';

      let resizeCleanup: (() => void) | undefined;

      // Handle auto-resize
      const autoResize = options.autoResize ?? true;
      if (autoResize) {
        // Throttled resize handling
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
      (map as any)._resizeCleanup = resizeCleanup;

      options.onMapCreated?.(map);
      setMapInstance(map);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (mapInstance) {
        // Cleanup resize handling
        const resizeCleanup = (mapInstance as any)._resizeCleanup;
        if (resizeCleanup && typeof resizeCleanup === 'function') {
          resizeCleanup();
        }

        options.onMapDestroy?.(mapInstance);
        mapInstance.remove();
        setMapInstance(null);
      }
    };
  }, [mapInstance]);

  return (
    <div ref={handleRef} style={{ width: '100%', height: '100%' }}>
      {mapInstance && children(mapInstance)}
    </div>
  );
}
