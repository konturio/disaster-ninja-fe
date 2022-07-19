import type { AppMetrics } from '../app-metrics';

export function allFeaturesReady(appMetrics: AppMetrics) {
  appMetrics
    .addSequence('allFeaturesReady')
    .on(appMetrics.loaded('appConfig'))
    /* Use something like this when we add all features readiness metric */
    .on(appMetrics.loaded('userResourceAtom'), (ctx, payload) => {
      const notLoadedFeatures = payload.getActiveFeatures();
      const sq = appMetrics.addSequence('featuresReady');
      notLoadedFeatures.forEach((feature) => {
        sq.on(appMetrics.loaded(feature), () => {
          notLoadedFeatures.delete(feature.id);
          if (ctx.features.size === 0) {
            return true;
          }
        });
      });
    })
    .on(appMetrics.loaded('featuresReady'), () => true);
}
