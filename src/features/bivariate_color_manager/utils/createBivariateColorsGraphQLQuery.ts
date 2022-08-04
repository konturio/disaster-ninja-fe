export function createBivariateColorsGraphQLQuery() {
  return `
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
      polygonStatistic(polygonStatisticRequest:{}) {
        bivariateStatistic {
          axis {
            ...AxisFields
          }
          meta {
            max_zoom
            min_zoom
          }
          indicators {
            name
            label
            direction
          }
          correlationRates {
            x {
              ...AxisFields
            }
            y {
              ...AxisFields
            }
            quality
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
