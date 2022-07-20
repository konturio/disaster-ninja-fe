import type { AppMetrics } from '../app-metrics';

export function allFeaturesReady(mtr: AppMetrics) {
  mtr
    .addSequence('allFeaturesReady')
    .on(mtr.loaded('appConfig'))
    /* Use something like this when we add all features readiness metric */
    .on(mtr.loaded('userResourceAtom'), (ctx, payload) => {
      const notLoadedFeatures = payload.getActiveFeatures();
      const sq = mtr.addSequence('featuresReady');
      notLoadedFeatures.forEach((feature) => {
        sq.on(mtr.loaded(feature));
      });
    })
    .on(mtr.loaded('featuresReady'), () => {
      /* Report */
    });
}
