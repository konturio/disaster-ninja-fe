import type { AppMetrics } from '../app-metrics';

export function eventReadyForScreenShot(mtr: AppMetrics) {
  mtr
    .addSequence('eventReadyForScreenShot')
    .on(mtr.loaded('appConfig'))
    .on(mtr.loaded('userResourceAtom'))
    .on(mtr.loaded('feature.map'), (ctx, map: maplibregl.Map) => {
      ctx.map = map;
    })
    .on(mtr.loading('areaLayersDetailsResourceAtom'), (ctx, payload) => {
      if (payload?.eventId === undefined) {
        return { continueSq: false };
      }
    })
    .on(mtr.loaded('areaLayersDetailsResourceAtom'), (ctx) => {
      ctx.map.loaded()
        ? setTimeout(() => mtr.mark('mapIdle')) // Here setTimeout because we want exit from this handler before process next handler
        : ctx.map.once('idle', () => mtr.mark('mapIdle'));
    })
    .on('mapIdle', () => {
      setTimeout(() => {
        const eventReadyEvent = new Event('event_ready_for_screenshot');
        window.dispatchEvent(eventReadyEvent);
      }, 1000); // Mapbox have ~1000ms fadeIn animation after it report first 'idle'
    });
}
