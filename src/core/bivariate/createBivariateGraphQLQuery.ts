import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { IMPORTANT_BIVARIATE_LAYERS } from './constants';

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

export function isGeometryEmpty(geom?: { geometry: GeoJSON.GeoJSON } | null): boolean {
  return (
    !geom ||
    !geom.geometry ||
    (geom.geometry.type === 'FeatureCollection' && !geom.geometry.features.length)
  );
}

export function createBivariateQuery(geom?: { geometry: GeoJSON.GeoJSON } | null) {
  const body: { importantLayers: string[][]; geoJSON?: GeoJSON.GeoJSON } = {
    importantLayers: IMPORTANT_BIVARIATE_LAYERS,
  };
  if (geom && !isGeometryEmpty(geom)) body.geoJSON = cleanupGeometry(geom?.geometry);

  return body;
}
