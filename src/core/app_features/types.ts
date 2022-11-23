import type { AppFeature, BackendFeatureType } from './constants';

export type AppFeatureType = typeof AppFeature[keyof typeof AppFeature];

export type BackendFeature = {
  name: string;
  description: string;
  type: typeof BackendFeatureType[keyof typeof BackendFeatureType];
};
