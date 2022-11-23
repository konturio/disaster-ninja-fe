import type { AppMetrics } from '../AppMetrics';

export function eventReadyForScreenShot(mtr: AppMetrics) {
  mtr
    .addSequence('eventReadyForScreenShot')
    .on('appConfig_loaded')
    .on('_done_userResourceAtom')
    .on('setMap_[Shared state] currentMapAtom', (ctx, map: maplibregl.Map) => {
      ctx.map = map;
    })
    .on('request_areaLayersDetailsResourceAtom', (ctx, payload) => {
      if (payload?.eventId === undefined) {
        return { continueSq: false };
      }
    })
    .on('_done_areaLayersDetailsResourceAtom')
    .on('change_layersLegends')
    .on('setTrue_mapIdle', () => {
      setTimeout(() => {
        const eventReadyEvent = new Event('event_ready_for_screenshot');
        window.dispatchEvent(eventReadyEvent);
      }, 1000); // Mapbox have ~1000ms fadeIn animation after it report first 'idle'
    });
}
