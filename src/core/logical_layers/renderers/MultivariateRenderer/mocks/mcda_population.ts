import type { MCDALayerStyle } from '../../stylesConfigs/mcda/types';

export const mcda_population: MCDALayerStyle = {
  type: 'mcda',
  config: {
    version: 4,
    id: 'MCDA_Population_DD15',
    name: 'MCDA_Population',
    layers: [
      {
        id: 'population|area_km2',
        name: 'Population (ppl/km²) (ppl/km²)',
        axis: ['population', 'area_km2'],
        indicators: [
          {
            name: 'population',
            label: 'population',
            emoji: '👫',
            description:
              'Number of people living in a given area according to Kontur Population dataset. The dataset was produced by overlaying the Global Human Settlement Layer (GHSL) with available Facebook population data and constraining known artifacts using OpenStreetMap data. The datasets detailed methodology is available here: https://data.humdata.org/dataset/kontur-population-dataset',
            direction: [['unimportant'], ['important']],
            unit: {
              id: 'ppl',
              shortName: 'ppl',
              longName: 'people',
            },
          },
          {
            name: 'area_km2',
            label: 'Area',
            description: '',
            copyrights: ['Concept of areas © Brahmagupta, René Descartes'],
            direction: [['neutral'], ['neutral']],
            unit: {
              id: 'km2',
              shortName: 'km²',
              longName: 'square kilometers',
            },
          },
        ],
        unit: 'ppl/km²',
        range: [2.4298085165474867e-7, 4242.697771672094],
        datasetStats: {
          minValue: 2.4298085165474867e-7,
          maxValue: 46199.999841762015,
          mean: 294.31122942540514,
          stddev: 1316.128847415563,
        },
        sentiment: ['good', 'bad'],
        outliers: 'clamp',
        coefficient: 1,
        transformationFunction: 'log',
        transformation: {
          transformation: 'log',
          mean: 1.379598535207945,
          skew: 0.5742166447471578,
          stddev: 0.8567607189605289,
          lowerBound: 1.0552523026435088e-7,
          upperBound: 3.4345006167130214,
        },
        normalization: 'max-min',
      },
    ],
    colors: {
      type: 'sentiments',
      parameters: {
        bad: 'rgba(228, 26, 28, 0.5)',
        good: 'rgba(90, 200, 127, 0.5)',
        midpoints: [
          {
            value: 0.5,
            color: 'rgba(251,237,170,0.5)',
          },
        ],
      },
    },
  },
};