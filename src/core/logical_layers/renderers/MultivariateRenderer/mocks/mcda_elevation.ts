import type { MCDALayerStyle } from '../../stylesConfigs/mcda/types';

export const mcda_elevation: MCDALayerStyle = {
  type: 'mcda',
  config: {
    version: 4,
    id: 'mcda_elevation_Q1bf',
    name: 'mcda_elevation',
    layers: [
      {
        id: 'avg_elevation_gebco_2022|one',
        name: 'Elevation (m)',
        axis: ['avg_elevation_gebco_2022', 'one'],
        indicators: [
          {
            name: 'avg_elevation_gebco_2022',
            label: 'Elevation',
            emoji: '🏔️',
            description: 'Average surface elevation in meters.',
            copyrights: [
              '© Data from General Bathymatric Chart of the Oceans, www.gebco.net',
            ],
            direction: [
              ['good', 'unimportant'],
              ['bad', 'important'],
            ],
            unit: {
              id: 'm',
              shortName: 'm',
              longName: 'meters',
            },
          },
          {
            name: 'one',
            label: '1',
            description: '',
            copyrights: ['Numbers © Muḥammad ibn Mūsā al-Khwārizmī'],
            direction: [['neutral'], ['neutral']],
            unit: {
              id: 'n',
              shortName: 'n',
              longName: 'number',
            },
          },
        ],
        unit: 'm',
        range: [-177.86384772246856, 1739.3812522499159],
        datasetStats: {
          minValue: -3046.5,
          maxValue: 8457.8,
          mean: 780.7587022637236,
          stddev: 958.6225499861922,
        },
        sentiment: ['good', 'bad'],
        outliers: 'clamp',
        coefficient: 1,
        transformationFunction: 'cube_root',
        transformation: {
          transformation: 'cube_root',
          mean: 7.580163105867827,
          skew: 0.6329266995660975,
          stddev: 2.9263247343915038,
          lowerBound: 1.4812480342036851,
          upperBound: 15.139440480920067,
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
