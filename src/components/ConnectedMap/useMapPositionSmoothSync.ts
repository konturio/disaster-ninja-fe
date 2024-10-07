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
    if (mapRef.current && currentMapPosition !== null) {
      const map = mapRef.current;
      const newMapPosition = currentMapPosition;
      const zoom = map.getZoom();
      const { lng, lat } = map.getCenter();
      const changeMapPosition = () => {
        map.resize();
        map.once('idle', () => {
          if ('lng' in newMapPosition && 'lat' in newMapPosition) {
            requestAnimationFrame(() => {
              map.easeTo({
                center: [newMapPosition.lng, newMapPosition.lat],
                zoom: newMapPosition.zoom,
                duration: 0,
              });
            });
          }
        });
      };
      /**
       * Compare current map position with update from state -
       * if map already have this position - ignore this update.
       * It's allow avoid cycled updates between map and state
       *  */
      if ('lng' in newMapPosition) {
        if (
          newMapPosition.lng !== lng ||
          newMapPosition.lat !== lat ||
          newMapPosition.zoom !== zoom
        ) {
          /* Allow interrupt map flying. Increase the timeout for bigger delay */
          const timeout = setTimeout(changeMapPosition, 100);
          const clear = () => clearTimeout(timeout);
          return () => {
            clear();
          };
        }
      }
    }
  }, [mapRef, currentMapPosition]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const onMapPositionChangedByUser = (e) => {
        if (e.originalEvent) {
          // only user events have original event
          const zoom = map.getZoom();
          const { lng, lat } = map.getCenter();
          currentMapPositionActions.setCurrentMapPosition({
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

  // return position;
}
