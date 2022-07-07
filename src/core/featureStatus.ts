import { AppFeature } from '~core/auth/types';

type FeatureRecord = { [featureKey: string]: 'ready' | null };

export const APPLICATION_MAP_KEY = 'application_map';
class FeatureStatus {
  private features: FeatureRecord = {};
  private mapTriggeringFeatures: string[] = [AppFeature.LAYERS_IN_AREA];
  private fullReadynessWasReported = false;

  public init(featuresIds: string[]) {
    // treat map as feature
    const newFeatures: FeatureRecord = { [APPLICATION_MAP_KEY]: null };
    featuresIds.forEach((feature) => (newFeatures[feature] = null));
    this.features = newFeatures;
  }

  public markReady(featureId: string) {
    if (this.fullReadynessWasReported) return;
    if (!(featureId in this.features))
      console.error('feature supposed be initialized first');

    if (this.mapTriggeringFeatures.includes(featureId)) {
      this.markUnready(APPLICATION_MAP_KEY);
      this.features[featureId] = 'ready';
      return;
    }

    this.features[featureId] = 'ready';
    if (
      Object.keys(this.features).length &&
      Object.values(this.features).every((value) => value === 'ready')
    ) {
      const duration = performance.now();
      this.fullReadynessWasReported = true;
    }
  }

  public markUnready(featureId: string) {
    if (this.fullReadynessWasReported) return;
    if (!(featureId in this.features))
      console.error('feature supposed be initialized first');
    this.features[featureId] = null;
  }
}

export const featureStatus = new FeatureStatus();
