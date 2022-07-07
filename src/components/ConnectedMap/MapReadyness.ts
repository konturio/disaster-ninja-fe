import { APPLICATION_MAP_KEY } from '~core/featureStatus';
import type maplibregl from 'maplibre-gl';

export function reportMapReadyness(
  map: maplibregl.Map,
  reportReady: (id: string) => void,
  reportNotReady: (id: string) => void,
) {
  let ready: boolean;
  map.on('data', () => {
    if (ready) {
      ready = false;
      reportNotReady(APPLICATION_MAP_KEY);
    }
    map.once('idle', () => {
      if (!ready) {
        ready = true;
        reportReady(APPLICATION_MAP_KEY);
      }
    });
  });
}
