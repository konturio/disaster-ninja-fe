import { createResourceAtom } from '~utils/atoms';
import { graphQlClient } from '~core/index';

export const bivariateStatisticsResourceAtom = createResourceAtom(
  null,
  async () => {
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
      polygonStatistic(polygonStatisticRequest: {}) {
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
    console.log('res', responseData);
    if (!responseData || !responseData.data)
      throw new Error('No data received');
    return responseData.data;
  },
  'bivariateStatisticsResource',
);
