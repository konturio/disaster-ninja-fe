import { AppFeature } from '~core/auth/types';

type FeatureRecord = { [featureKey: string]: 'ready' | null };

export const APPLICATION_MAP_KEY = 'application_map';

// theese features are either redundant or not yet implemented
// task for figuring this out is #11105
const exceptions = [
  AppFeature.COMMUNITIES,
  AppFeature.CURRENT_EPISODE,
  AppFeature.DRAW_TOOLS,
  AppFeature.EPISODE_LIST,
  AppFeature.FEATURE_SETTINGS,
  AppFeature.INTERACTIVE_MAP,
  AppFeature.GEOCODER,
  'app_registration',
  'url_store',
  'popup',
  'routing',
  'share_map',
  'translation',
  'kontur-public',
];
class FeatureStatus {
  private features: FeatureRecord = {};
  private fullReadynessReported = false;

  public init(featuresIds: string[]) {
    // treat map as feature
    const newFeatures: FeatureRecord = { [APPLICATION_MAP_KEY]: null };
    featuresIds.forEach((feature) => (newFeatures[feature] = null));
    exceptions.forEach(
      (exception) => exception in newFeatures && delete newFeatures[exception],
    );
    this.features = newFeatures;
  }

  public markReady(featureId: string, affectsMap?: boolean) {
    if (this.fullReadynessReported) return;
    if (!(featureId in this.features))
      console.error('feature supposed be initialized first - ', featureId);

    if (affectsMap) {
      this.markUnready(APPLICATION_MAP_KEY);
      this.features[featureId] = 'ready';
      return;
    }

    this.features[featureId] = 'ready';
    if (
      Object.keys(this.features).length &&
      Object.values(this.features).every((value) => value === 'ready')
    ) {
      const readyInMilliseconds = Math.floor(performance.now());
      console.warn(
        `application ready in ${readyInMilliseconds * 0.001} seconds`,
      );
      this.fullReadynessReported = true;
    }
  }

  public markUnready(featureId: string) {
    if (this.fullReadynessReported) return;
    if (!(featureId in this.features))
      console.error('feature supposed be initialized first');
    this.features[featureId] = null;
  }

  // todo #11232 when done we can store init time and readyness time for each feature
  // - register start here, register finish on ready
  public getReadynessCb(
    featureId: string,
    affectsApplicationMap: boolean,
  ): () => void {
    return () => this.markReady(featureId, affectsApplicationMap);
  }
}

export const featureStatus = new FeatureStatus();
