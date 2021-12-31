import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/index';
import { focusedGeometryAtom } from '~core/shared_state';

const escapeQuotes = (str: string) => `"${str.replaceAll('"', '\\"')}"`;
let allMapStats: any;

export const bivariateStatisticsResourceAtom = createResourceAtom(
  focusedGeometryAtom,
  async (geom) => {
    if (!geom && allMapStats) {
      return allMapStats;
    }

    const polygonStatisticRequest = geom
      ? `{ polygon: ${escapeQuotes(JSON.stringify(geom.geometry))} }`
      : '{}';

    const responseData = await graphQlClient.post<any>(`/`, {
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
