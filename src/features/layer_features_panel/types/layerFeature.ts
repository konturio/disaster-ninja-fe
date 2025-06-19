import type { Bbox } from '~core/shared_state/currentMapPosition';
import type { Feature } from 'geojson';

export interface LayerFeatureProperties {
  bbox?: Bbox;
  aoiBBOX?: Bbox;
  [key: string]: any;
}

export type LayerFeature = Feature & {
  properties: LayerFeatureProperties;
  bbox?: Bbox;
};
