import { ApisauceInstance, create } from 'apisauce';
import { GetStatisticsType } from '@services/api/apiTypes';
import { getGeneralApiProblem } from '@services/api/apiProblem';
import { gql } from 'graphql-tag';
import { getRawQuery } from '@utils/graphql/getRawQuery';

class GraphqlClient {
  api: ApisauceInstance | undefined;

  setup(apiUrl: string) {
    this.api = create({
      baseURL: apiUrl,
      timeout: 20000,
      headers: {
        Accept: 'application/json',
      },
    });
  }

  // get static data
  async getStatics(polygon: string | null = null): Promise<GetStatisticsType> {
    if (!this.api) return { kind: 'bad-data' };

    const escapeQuotes = (str: string) => `"${str.replaceAll('"', '\\"')}"`;
    const polygonStatisticRequest = polygon
      ? `{ polygon: ${escapeQuotes(polygon)} }`
      : '{}';

    const queryAST = gql`
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
    }`;

    const response = await this.api.post('/', { query: getRawQuery(queryAST) });

    if (!response.ok) {
      const problem = getGeneralApiProblem(response);
      if (problem) return problem;
    }

    return {
      kind: 'ok',
      data: (response.data as any).data.polygonStatistic.bivariateStatistic,
    };
  }
}

export default new GraphqlClient();
