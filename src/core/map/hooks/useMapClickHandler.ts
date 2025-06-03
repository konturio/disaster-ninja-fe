import { useEffect } from 'react';
import type { Map } from 'maplibre-gl';
import type {
  MapClickHandler,
  MapClickEvent,
  ScreenPoint,
  GeographicPoint,
} from '../types';

interface UseMapClickHandlerOptions<T = any> {
  handler: MapClickHandler<T>;
  featureSelector?: (e: any) => T[];
  enabled?: boolean;
}

export function useMapClickHandler<T = any>(
  map: Map | null,
  options: UseMapClickHandlerOptions<T>,
) {
  const { handler, featureSelector = defaultFeatureSelector, enabled = true } = options;

  useEffect(() => {
    if (!map || !enabled) return;

    const onClick = (originalEvent: any) => {
      const features = featureSelector(originalEvent);
      const point: ScreenPoint = {
        x: originalEvent.point.x,
        y: originalEvent.point.y,
      };
      const lngLat: GeographicPoint = {
        lng: originalEvent.lngLat.lng,
        lat: originalEvent.lngLat.lat,
      };

      const clickEvent: MapClickEvent<T> = {
        point,
        lngLat,
        features,
        originalEvent,
      };

      handler.handleClick(clickEvent);
    };

    map.on('click', onClick);

    return () => {
      map.off('click', onClick);
    };
  }, [map, handler, featureSelector, enabled]);
}

function defaultFeatureSelector(e: any) {
  return e.target?.queryRenderedFeatures?.(e.point) || [];
}
