import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { isGeoJSONEmpty } from '~utils/geoJSON/helpers';
import { IMPORTANT_BIVARIATE_LAYERS } from './constants';
import type { FocusedGeometry } from '~core/focused_geometry/types';

// we need this function to get rid of "properties" param in geojson geom cause
// sometimes it contains inappropriate symbols like ":" which causes server side errors
function cleanupGeometry(geom: GeoJSON.GeoJSON): GeoJSON.GeoJSON {
  const newGeom = deepCopy(geom);

  if ('properties' in newGeom) {
    newGeom.properties = {};
  }
  if ('features' in newGeom && newGeom.features?.length) {
    newGeom.features = newGeom.features.map(
      (feature) => cleanupGeometry(feature) as GeoJSON.Feature,
    );
  }

  return newGeom;
}

export function isFocusedGeometryEmpty(
  focusedGeometry?: FocusedGeometry | null,
): boolean {
  return !focusedGeometry || isGeoJSONEmpty(focusedGeometry.geometry);
}

export function createBivariateQuery(geom?: FocusedGeometry | null) {
  const body: { importantLayers: string[][]; geoJSON?: GeoJSON.GeoJSON } = {
    importantLayers: IMPORTANT_BIVARIATE_LAYERS,
  };
  if (geom && !isFocusedGeometryEmpty(geom))
    body.geoJSON = cleanupGeometry(geom?.geometry);

  return body;
}
