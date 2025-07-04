import type { LngLatBoundsLike } from 'maplibre-gl';

export type FeaturesPanelItem = {
  properties: object;
  id?: string | number;
  focus?: LngLatBoundsLike;
};
