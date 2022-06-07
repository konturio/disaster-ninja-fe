import type { EventData, MapEventType } from 'maplibre-gl';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

export const waitMapEvent = <T extends keyof MapEventType>(
  map: ApplicationMap,
  event: T,
) =>
  new Promise<MapEventType[T] & EventData>((res, rej) => {
    try {
      map.on(event, res);
    } catch (error) {
      rej(error);
    }
  });
