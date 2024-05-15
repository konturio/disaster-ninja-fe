import { i18n } from '~core/localization';
import type { Feature } from 'geojson';
import type { GeometryWithHash } from '~core/focused_geometry/types';

const geometryTypeNames = {
  Point: i18n.t('profile.reference_area.types.point'),
  LineString: i18n.t('profile.reference_area.types.line'),
  Polygon: i18n.t('profile.reference_area.types.polygon'),
};

function getSingleGeometryFeatureType(geometryFeature: Feature) {
  if (geometryFeature.properties?.name) {
    return geometryFeature.properties.name;
  } else if (geometryFeature.geometry.type) {
    return (
      geometryTypeNames[geometryFeature.geometry.type] ?? geometryFeature.geometry.type
    );
  }
  return i18n.t('profile.reference_area.types.unknown_type');
}

export function getReferenceAreaName(referenceAreaGeometry: GeometryWithHash): string {
  if (referenceAreaGeometry?.type === 'FeatureCollection') {
    if (referenceAreaGeometry.features?.length === 1) {
      return getSingleGeometryFeatureType(referenceAreaGeometry.features[0]);
    } else {
      return i18n.t('profile.reference_area.types.complex_geometry');
    }
  }
  if (referenceAreaGeometry?.type === 'Feature') {
    if (referenceAreaGeometry.properties?.name) {
      // Return name if it's in properties (for admin units)
      return referenceAreaGeometry.properties.name;
    } else {
      // Return geometry type
      return getSingleGeometryFeatureType(referenceAreaGeometry);
    }
  }
  // write "Geometry" as a fallback in case we missed such case
  return i18n.t('profile.reference_area.types.geometry');
}
