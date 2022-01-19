import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';

function stringifyWithoutQuotes(obj: unknown): string {
  const json = JSON.stringify(obj);
  return json.replace(/"([^"]+)":/g, '$1:');
}

// we need this function to get rid of "properties" param in geojson geom cause
// sometimes it contains inappropriate symbols like ":" which causes server side errors
function cleanupGeometry(geom: GeoJSON.GeoJSON): GeoJSON.GeoJSON {
  const newGeom = geom as any;

  if ('properties' in newGeom) {
    newGeom.properties = {};
  }
  if ('features' in newGeom && newGeom.features.length) {
    newGeom.features.forEach((feat) => cleanupGeometry(feat));
  }

  return newGeom;
}

let allMapStats: unknown;

export const bivariateStatisticsResourceAtom = createResourceAtom(
  focusedGeometryAtom,
  async (geom) => {
    if (!geom && allMapStats) {
      return allMapStats;
    }

    const polygonStatisticRequest = geom
      ? `{ polygonV2: ${stringifyWithoutQuotes(cleanupGeometry(geom.geometry))} }`
      : '{}';

    const responseData = await graphQlClient.post<{ data?: unknown }>(`/`, {
      query: `
      fragment AxisFields on Axis {
        label
        steps {
          label
          value
        }
        quality
        quotient
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
    }`,
    });

    if (!responseData || !responseData.data) {
      throw new Error('No data received');
    }

    if (!geom && !allMapStats) {
      allMapStats = responseData.data;
    }

    return responseData.data;
  },
  'bivariateStatisticsResource',
);
