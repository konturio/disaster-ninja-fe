import { test, describe, expect } from 'vitest';
import cvstojson from 'csvtojson';
import { calculateLayerPipeline, inViewCalculations } from '.';
import type { MCDALayer, TransformationFunction } from '../types';

const PRECISION = 0.0000000001;

type TransformationTestData = {
  lowerBound: number;
  upperBound: number;
  expectedScore: number;
};

interface MCDATestEntryDTO {
  testId: number;
  description: string;
  axis: Partial<MCDALayer>;
  value: {
    numerator: number;
    denominator: number;
  };
  transformation: Record<TransformationFunction, TransformationTestData>;
}

describe('mcda calculations', async () => {
  const filePath = __dirname + '/testData/calculateLayerPipeline.testdata.csv';
  let jsonResult: MCDATestEntryDTO[] | undefined;
  await cvstojson({
    checkType: true,
    nullObject: true,
  })
    .fromFile(filePath)
    .then((json) => {
      jsonResult = json;
    });

  if (!jsonResult?.length) {
    throw new Error('Could not find test data in csv file');
  }
  jsonResult.forEach((testEntry) => {
    test(`${testEntry.testId}: ${testEntry.description}`, () => {
      expect(testEntry.description).toBeTruthy();
      const calculateNumber = calculateLayerPipeline(inViewCalculations, (axis) => ({
        num: testEntry.value.numerator,
        den: testEntry.value.denominator,
      }));
      const transformationFunctions: TransformationFunction[] = [
        'no',
        'log',
        'log_epsilon',
        'square_root',
        'cube_root',
      ];
      for (const transformationFunction of transformationFunctions) {
        const testAxis: MCDALayer = {
          ...DEFAULT_AXIS,
          ...testEntry.axis,
          transformation: {
            ...DEFAULT_AXIS.transformation!,
            transformation: transformationFunction,
            lowerBound: testEntry.transformation[transformationFunction].lowerBound,
            upperBound: testEntry.transformation[transformationFunction].upperBound,
          },
        };
        expect(
          Math.abs(
            calculateNumber(testAxis) -
              testEntry.transformation[transformationFunction].expectedScore,
          ),
        ).toBeLessThanOrEqual(PRECISION);
      }
    });
  });
});

const DEFAULT_AXIS: MCDALayer = {
  id: 'test',
  name: 'TEST',
  axis: ['indicator_numerator', 'indicator_denominator'],
  indicators: [
    {
      name: 'indicator_numerator',
      label: 'Numerator label',
      unit: {
        id: 'celc_deg',
        shortName: '°C',
        longName: 'degrees Celsius',
      },
    },
    {
      name: 'indicator_denominator',
      label: 'Denominator label',
      unit: {
        id: 'null',
        shortName: null,
        longName: null,
      },
    },
  ],
  range: [0, 100],
  sentiment: ['bad', 'good'],
  coefficient: 1,
  outliers: 'clamp',
  transformationFunction: 'no',
  transformation: {
    skew: 0,
    stddev: 0,
    mean: 0,
    lowerBound: 0,
    upperBound: 0,
    transformation: 'no',
  },
  normalization: 'max-min',
  unit: '',
  datasetStats: { minValue: -30, maxValue: 100, mean: 0, stddev: 10 },
};
