import { useEffect } from 'react';

export function useDisableDoubleClick(mapRef) {
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.doubleClickZoom.disable();
    }
  }, [mapRef]);
}
