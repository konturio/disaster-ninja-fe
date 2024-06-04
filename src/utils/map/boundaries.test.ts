import { expect, test, describe, it } from 'vitest';
import { getLocalizedFeatureName } from './boundaries';

const FEATURE: GeoJSON.Feature = {
  id: '913067_ID',
  properties: {
    name: 'NAME',
    tags: {
      int_name: 'Shanghai:INT',
      'name:en': 'Shanghai:EN',
      'name:uk': 'Шанхай:UK',
      'name:zh': '上海市:ZH',
      'name:es': 'Shanghái:ES',
    },
  },
  geometry: {
    type: 'MultiPolygon',
    coordinates: [],
  },
  type: 'Feature',
};

describe('getLocalizedFeatureName', () => {
  it('should return the first available localized name from the list of preferred languages', () => {
    expect(getLocalizedFeatureName(FEATURE, ['fr', 'uk', 'en', 'es'])).toEqual(
      FEATURE.properties!.tags['name:uk'],
    );
    expect(
      getLocalizedFeatureName(FEATURE as GeoJSON.Feature, ['zh', 'fr', 'uk', 'en']),
    ).toEqual(FEATURE.properties!.tags['name:zh']);
  });

  it('should return international name if none of the preferred languages is available', () => {
    expect(
      getLocalizedFeatureName(FEATURE as GeoJSON.Feature, ['fr', 'by', 'fi']),
    ).toEqual(FEATURE.properties!.tags.int_name);
  });

  it('should return standard feature name if neither localized nor international name is available', () => {
    const featureWithoutIntName = structuredClone(FEATURE);
    featureWithoutIntName.properties!.tags.int_name = '';
    expect(
      getLocalizedFeatureName(featureWithoutIntName as GeoJSON.Feature, [
        'fr',
        'by',
        'fi',
      ]),
    ).toEqual(FEATURE.properties!.name);
  });
});
