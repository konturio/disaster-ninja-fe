import type maplibregl from 'maplibre-gl';

export function reportMapReadyness(
  map: maplibregl.Map,
  reportReady: () => void,
  reportNotReady: () => void,
) {
  let ready: boolean;
  map.on('data', () => {
    if (ready) {
      ready = false;
      reportNotReady();
    }
    map.once('idle', () => {
      if (!ready) {
        ready = true;
        reportReady();
      }
    });
  });
}
