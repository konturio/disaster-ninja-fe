import { useEffect } from 'react';
import { useAtom } from '@reatom/npm-react';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import type { MutableRefObject } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

/**
 * This hook listens to map's moveend events and updates currentMapPosition atom state.
 * */
export function useMapPositionSync(mapRef: MutableRefObject<MapLibreMap | undefined>) {
  const [, updateCurrentMapPositionAtom] = useAtom(currentMapPositionAtom);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const onMapPositionChangedByUser = (e) => {
        if (e.originalEvent) {
          // only user events have original event
          const zoom = map.getZoom();
          const { lng, lat } = map.getCenter();
          updateCurrentMapPositionAtom({
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
  }, [mapRef, updateCurrentMapPositionAtom]);
}
