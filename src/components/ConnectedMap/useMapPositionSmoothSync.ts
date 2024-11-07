import { useEffect } from 'react';
import { useAtom } from '@reatom/react-v2';
import { currentMapPositionAtom } from '~core/shared_state';
import type { MutableRefObject } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * This effect allow to listen state changes, and fly to position that set externally in atom
 * And allow to read current map position and update atom state with actual data.
 * */
export function useMapPositionSmoothSync(
  mapRef: MutableRefObject<MapLibreMap | undefined>,
) {
  const [currentMapPosition, currentMapPositionActions] = useAtom(currentMapPositionAtom);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const onMapPositionChangedByUser = (e) => {
        if (e.originalEvent) {
          // only user events have original event
          const zoom = map.getZoom();
          const { lng, lat } = map.getCenter();
          currentMapPositionActions.updateCurrentPosition({
            zoom,
            lat,
            lng,
          });
        }
      };

      map.on('moveend', onMapPositionChangedByUser);
      return () => {
        map.off('moveend', onMapPositionChangedByUser);
      };
    }
  }, [mapRef, currentMapPositionActions]);
}
