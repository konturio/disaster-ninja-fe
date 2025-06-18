import { throttle } from '@github/mini-throttle';
import { useMapEffect } from './useMapEffect';
import type { IMap } from '../providers/IMapProvider';

interface PositionTrackingConfig {
  onPositionChange: (position: { lng: number; lat: number; zoom: number }) => void;
  throttleMs?: number;
  trackUserOnly?: boolean;
}

export function useMapPositionTracking<TMap extends IMap>(
  map: TMap,
  config: PositionTrackingConfig,
): void {
  const { onPositionChange, throttleMs = 16, trackUserOnly = true } = config;

  useMapEffect(
    map,
    (map) => {
      const throttledCallback = throttle(onPositionChange, throttleMs);

      const handleMove = (e?: any) => {
        if (trackUserOnly && !e?.originalEvent) return;

        const center = map.getCenter();
        const zoom = map.getZoom();
        throttledCallback({ lng: center.lng, lat: center.lat, zoom });
      };

      map.on('moveend', handleMove);
      return () => {
        map.off('moveend', handleMove);
        throttledCallback.cancel();
      };
    },
    [onPositionChange, throttleMs, trackUserOnly],
  );
}
