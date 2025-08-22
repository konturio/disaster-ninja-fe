# Bivariate matrix calculation

The base terms and elements of Bivariate matrix are described in the document [[Tasks/project: Bivariate Manager#^131cd711-3bb4-11e9-9428-04d77e8d50cb/c4a79070-96cd-11eb-83ce-250e9b944601]] 

Additional details:
* Bivariate matrix can be calculated for the whole world or for the selected area only. Algorithm of correlation rate calculation depends on input parameters:
  * without parameters - calculate correlation the whole world, for all layers
  * polygon - calculate correlation for the selected area. If the matrix is calculated for the selected area, it contains only layers that have data for the selected area (condition `min_value=max_value` for the indicators inside hexagons). 
* We calculate the average correlation for each axis for base and annex matrix sides:
  * there are differences as the matrix is not symmetric → contains axes with base indicators as numerators only on the base side of the matrix
  * we use average correlation to sort axes → the higher the average correlation the closer axis to the center of the matrix 
* The first iteration of the bivariate matrix included the calculation of correlations only (and average correlation for sorting), but it was reworked to be able to get more insights.
* Now not only correlation can be calculated but covariance also (the list can be expanded). An example of the request is below.
* fields `correlation`, `avgCorrelationX`, `avgCorrelationY `are left for backward compatibility and can be deleted in the future ([[Tasks/Task: Refactoring after generalize calculations will be used#^7b708802-3c0b-11e9-9428-04d77e8d50cb/674461e0-2e8b-11ed-9282-9b4191c36424]] ).  `metrics`, `avgMetricsX`, `avgMetricsY `should be used instead.

```
{
	polygonStatistic(polygonStatisticRequest: {
		polygonV2: {
			type: FeatureCollection,
			features: [{
				type: Feature,
				properties: {},
				geometry: {
					type: Polygon,
					coordinates: [
						[
							[14.94435691969139, 37.78188362295296],
							[14.937721694800931, 37.70702089561007],
							[15.073391451732734, 37.704118557306046],
							[15.076269766530125, 37.77956169748524],
							[14.94435691969139, 37.78188362295296]
						]
					]
				}
			}]
		}
	}) {
		bivariateStatistic {
			correlationRates {
				x {
					label
					quality
				}
				y {
					label
					quality
				}
				rate
				quality
				correlation
				metrics
				avgCorrelationX
				avgCorrelationY
				avgMetricsX
				avgMetricsY
			}
			covarianceRates {
				x {
					label
					quality
				}
				y {
					label
					quality
				}
				rate
				quality
				correlation
				metrics
				avgCorrelationX
				avgCorrelationY
				avgMetricsX
				avgMetricsY
			}

		}
	}
}
```
