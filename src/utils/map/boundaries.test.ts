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
  it('should return available localized name for preferred language', () => {
    expect(getLocalizedFeatureName(FEATURE, 'uk')).toEqual(
      FEATURE.properties!.tags['name:uk'],
    );
    expect(getLocalizedFeatureName(FEATURE as GeoJSON.Feature, 'zh')).toEqual(
      FEATURE.properties!.tags['name:zh'],
    );
  });

  it("should return international name if preferred language isn't available", () => {
    expect(getLocalizedFeatureName(FEATURE as GeoJSON.Feature, 'by')).toEqual(
      FEATURE.properties!.tags.int_name,
    );
  });

  it('should return standard feature name if neither localized nor international name is available', () => {
    const featureWithoutIntName = structuredClone(FEATURE);
    featureWithoutIntName.properties!.tags.int_name = '';
    expect(
      getLocalizedFeatureName(featureWithoutIntName as GeoJSON.Feature, 'fr'),
    ).toEqual(FEATURE.properties!.name);
  });
});
