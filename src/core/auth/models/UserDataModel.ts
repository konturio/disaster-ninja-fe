import { AppFeatureType, UserFeed } from '~core/auth/types';

export class UserDataModel {
  private readonly _features: { [T in AppFeatureType]?: boolean } = {};
  private readonly _feeds: UserFeed[] | null = [];

  constructor({
    features,
    feeds,
  }: {
    features: { [T in AppFeatureType]?: boolean };
    feeds: UserFeed[] | null;
  }) {
    this._features = features;
    this._feeds = feeds;
  }

  public get defaultFeed(): UserFeed | undefined {
    return this._feeds?.find((fd) => fd.isDefault);
  }

  public checkFeed(feedId?: string): string | undefined {
    if (!feedId) return this.defaultFeed?.feed;
    const feed = this._feeds?.find((fd) => fd.feed === feedId);
    return feed ? feed.feed : this.defaultFeed?.feed;
  }

  public hasFeature(featureType: AppFeatureType): boolean {
    return this._features && this._features[featureType] === true;
  }

  public get feeds() {
    return this._feeds;
  }
}
