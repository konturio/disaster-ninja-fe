import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';
import { Stat } from '@k2-packages/bivariate-tools';
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

interface BivariateStatisticsResponse {
  polygonStatistic: {
    bivariateStatistic: Stat;
  };
}

let allMapStats: BivariateStatisticsResponse;

// hard coded to HOT layers for now (task 7801)
const importantLayers = [
  ['count', 'area_km2'],
  ['building_count', 'area_km2'],
  ['highway_length', 'area_km2'],
  ['local_hours', 'area_km2'],
  ['avgmax_ts', 'one'],
  ['days_mintemp_above_25c_1c', 'one'],
  ['population', 'area_km2'],
  ['total_hours', 'area_km2'],
  ['view_count', 'area_km2'],
];

export const bivariateStatisticsResourceAtom = createResourceAtom(
  async (geom) => {
    if (!geom && allMapStats) {
      return allMapStats;
    }

    const geomNotEmpty = !!(
      geom &&
      geom.geometry &&
      (geom.geometry.type !== 'FeatureCollection' ||
        geom.geometry.features.length)
    );

    const polygonStatisticRequest =
      geom && geomNotEmpty
        ? `{ polygonV2: ${stringifyWithoutQuotes(
            cleanupGeometry(geom.geometry),
          )}, importantLayers: ${JSON.stringify(importantLayers)} }`
        : '{}';

    const responseData = await graphQlClient.post<{
      data: BivariateStatisticsResponse;
    }>(`/`, {
      query: `
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
    }`,
    });

    if (!responseData || !responseData.data) {
      throw new Error('No data received');
    }

    if (!geomNotEmpty && !allMapStats) {
      allMapStats = responseData.data;
    }

    return responseData.data;
  },
  focusedGeometryAtom,
  'bivariateStatisticsResource',
);
