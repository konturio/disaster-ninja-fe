import type { EventData, MapEventType } from 'maplibre-gl';
import type { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

export const waitMapEvent = <T extends keyof MapEventType>(
  map: ApplicationMap,
  event: T,
) =>
  new Promise<(MapEventType[T] & EventData) | void>((res, rej) => {
    try {
      map.on(event, res);
    } catch (error) {
      rej(error);
    }
  });

export async function mapLoaded(map: ApplicationMap) {
  // Use hidden maplibre method for reliability. Explanation - https://github.com/konturio/disaster-ninja-fe/issues/101
  // @ts-expect-error
  if (!map._loaded) {
    return waitMapEvent(map, 'load');
  }
  return;
}
