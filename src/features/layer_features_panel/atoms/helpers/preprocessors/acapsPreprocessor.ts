import type { Feature } from 'geojson';

export function acapsPreprocessor(feature: Feature): Feature {
  const properties = feature.properties;
  switch (properties?.['acaps_source_dataset']) {
    case 'Risk list':
      properties['isRiskList'] = true;
      break;
    case 'Seasonal events calendar':
      properties['isSeasonalEvents'] = true;
      break;
    case 'Information landscape dataset':
      properties['isInformationLandscape'] = true;
      break;
    case 'Protection risks monitor':
      properties['isProtectionRisks'] = true;
      break;
  }
  return feature;
}
