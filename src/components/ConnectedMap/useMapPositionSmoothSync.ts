import { useEffect } from 'react';
import { useAtom } from '@reatom/react';
import { currentMapPositionAtom } from '~core/shared_state';

/**
 * This effect allow to listen state changes, and fly to position that set externally in atom
 * And allow to read current map position and update atom state with actual data.
 * */
export function useMapPositionSmoothSync(mapRef) {
  const [currentMapPosition, currentMapPositionActions] = useAtom(
    currentMapPositionAtom,
  );

  useEffect(() => {
    if (mapRef.current && currentMapPosition !== null) {
      const map = mapRef.current;
      const maybeChangeMapPosition = () => {
        const newMapPosition = currentMapPosition;
        const zoom = map.getZoom();
        const { lng, lat } = map.getCenter();
        /**
         * Compare current map position with update from state -
         * if map already have this position - ignore this update.
         * It's allow avoid cycled updates between map and state
         *  */
        if (
          newMapPosition.lng !== lng ||
          newMapPosition.lat !== lat ||
          newMapPosition.zoom !== zoom
        ) {
          map.easeTo({
            center: [lng, lat],
            zoom: newMapPosition.zoom,
            duration: 3000,
          });
        }
      };

      /* Allow interrupt map flying */
      const timeout = setTimeout(maybeChangeMapPosition, 1600);
      const clear = () => clearTimeout(timeout);
      map.on('movestart', clear);
      return () => {
        map.off('movestart', clear);
        clear();
      };
    }
  }, [mapRef, currentMapPosition]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const onMapPositionChangedByUser = () => {
        const zoom = map.getZoom();
        const { lng, lat } = map.getCenter();
        currentMapPositionActions.setCurrentMapPosition({ zoom, lat, lng });
      };

      /**
       * Update state only after *user* made map position changes
       * ! Avoid to update map position using mapbox api directly because of this
       * Use map position atom instead
       **/
      map.on('dragend', onMapPositionChangedByUser);
      map.on('zoomend', onMapPositionChangedByUser);
      return () => {
        map.off('dragend', onMapPositionChangedByUser);
        map.off('zoomend', onMapPositionChangedByUser);
      };
    }
  }, [mapRef, currentMapPositionActions]);
}
