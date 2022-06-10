import { IMPORTANT_BIVARIATE_LAYERS } from '~features/bivariate_manager/constants';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';

function stringifyWithoutQuotes(obj: unknown): string {
  const json = JSON.stringify(obj);
  return json.replace(/"([^"]+)":/g, '$1:');
}

// we need this function to get rid of "properties" param in geojson geom cause
// sometimes it contains inappropriate symbols like ":" which causes server side errors
function cleanupGeometry(geom: GeoJSON.GeoJSON): GeoJSON.GeoJSON {
  const newGeom = deepCopy(geom);

  if ('properties' in newGeom) {
    newGeom.properties = {};
  }
  if ('features' in newGeom && newGeom.features.length) {
    newGeom.features.forEach((feat) => cleanupGeometry(feat));
  }

  return newGeom;
}

export function isGeometryEmpty(geom?: { geometry: GeoJSON.GeoJSON } | null): boolean {
  return !geom || !geom.geometry || (geom.geometry.type === 'FeatureCollection' && !geom.geometry.features.length);
}

export function createBivariateGraphQLQuery(geom?: { geometry: GeoJSON.GeoJSON } | null) {
  const importantLayersRequest = `importantLayers: ${JSON.stringify(
    IMPORTANT_BIVARIATE_LAYERS,
  )}`;

  const polygonStatisticRequest =
    geom && !isGeometryEmpty(geom) ?
      `{ polygonV2: ${stringifyWithoutQuotes(cleanupGeometry(geom.geometry))}, ${importantLayersRequest} }`
      : `{ ${importantLayersRequest} }`;

  return `
      fragment AxisFields on Axis {
        label
        steps {
          label
          value
        }
        quality
        quotient
        parent
      }

    query getPolygonStatistics {
      polygonStatistic(polygonStatisticRequest: ${polygonStatisticRequest}) {
        bivariateStatistic {
          axis {
            ...AxisFields
          }
          meta {
            max_zoom
            min_zoom
          }
          overlays {
            name
            description
            active
            colors {
              id
              color
            }
            x {
              ...AxisFields
            }
            y {
              ...AxisFields
            }
          }
          indicators {
            name
            label
            copyrights
            direction
          }
          correlationRates {
            x {
              ...AxisFields
            }
            y {
              ...AxisFields
            }
            rate
            quality
            correlation
            avgCorrelationX
            avgCorrelationY
          }
          colors {
            fallback
            combinations {
              color
              corner
              color_comment
            }
          }
        }
      }
    }`;
}
