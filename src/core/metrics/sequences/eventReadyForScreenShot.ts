import type { AppMetrics } from '../app-metrics';

export function eventReadyForScreenShot(appMetrics: AppMetrics) {
  appMetrics
    .addSequence('eventReadyForScreenShot')
    .on(appMetrics.loaded('appConfig'))
    .on(appMetrics.loaded('userResourceAtom'))
    .on(appMetrics.loaded('feature.map'), (ctx, map: maplibregl.Map) => {
      ctx.map = map;
    })
    .on(appMetrics.loaded('areaLayersDetailsResourceAtom'), (ctx) => {
      ctx.map.loaded()
        ? appMetrics.mark('mapIdle')
        : ctx.map.once('idle', () => appMetrics.mark('mapIdle'));
    })
    .on('mapIdle', () => {
      setTimeout(() => {
        const eventReadyEvent = new Event('event_ready_for_screenshot');
        document.body.dispatchEvent(eventReadyEvent);
      }, 1000); // Mapbox have ~1000ms fadeIn animation after it report first 'idle'
      return true;
    });
}
