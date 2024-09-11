import fs from 'fs';
import { test, describe, expect } from 'vitest';
import papa from 'papaparse';
import * as dot from 'dot-object';
import { calculateLayerPipeline, inViewCalculations } from '.';
import type { MCDALayer, TransformationFunction } from '../types';

const PRECISION = 0.0000000001;

describe('mcda calculations', async () => {
  const filePath = __dirname + '/testData/calculateLayerPipeline.testdata.csv';
  const jsonResult: MCDATestEntry[] = await parseCsvTestFile(filePath);
  if (!jsonResult?.length) {
    throw new Error('Could not find parsed test data');
  }
  jsonResult.forEach((testEntry) => {
    test(`${testEntry.testId}: ${testEntry.description}`, () => {
      expect(testEntry.description).toBeTruthy();
      const calculateNumber = calculateLayerPipeline(inViewCalculations, () => ({
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
        const calculatedScore = calculateNumber(testAxis);
        const expectedScore =
          testEntry.transformation[transformationFunction].expectedScore;
        expect(
          Math.abs(calculatedScore - expectedScore),
          `{ testId: ${testEntry.testId}, transformation: ${transformationFunction}, expectedScore: ${expectedScore}, score: ${calculatedScore} }`,
        ).toBeLessThanOrEqual(PRECISION);
      }
    });
  });
});

function parseCsvTestFile(filePath: string): Promise<MCDATestEntry[]> {
  const file = fs.readFileSync(filePath).toString();
  return new Promise((res) => {
    papa.parse<FlatMCDATestEntryDTO>(file, {
      dynamicTyping: true,
      header: true,
      delimiter: ',',
      skipEmptyLines: true,
      complete: (parsed) => {
        if (parsed.errors.length > 0) {
          throw new Error(
            `Error parsing csv file:', ${parsed.errors.map((err) => `\n(row #${err.row}) ${err.type}: ${err.message}`, 0)}`,
          );
        }
        const expandedResult = parsed.data.map<MCDATestEntry>(
          (row) => dot.object(row) as MCDATestEntry,
        );
        res(expandedResult);
      },
      error: (e) => {
        throw e;
      },
    });
  });
}

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

type TransformationTestData = {
  lowerBound: number;
  upperBound: number;
  expectedScore: number;
};
interface MCDATestEntry {
  testId: number;
  description: string;
  axis: Partial<MCDALayer>;
  value: {
    numerator: number;
    denominator: number;
  };
  transformation: Record<TransformationFunction, TransformationTestData>;
}

type FlatMCDATestEntryDTO = {
  testId: number;
  description: string;
  'axis.coefficient': number;
  'axis.sentiment[0]': string;
  'axis.sentiment[1]': string;
  'axis.normalization': string;
  'axis.outliers': string;
  'axis.datasetStats.minValue': number;
  'axis.range[0]': number;
  'axis.range[1]': number;
  'value.numerator': number;
  'value.denominator': number;
  'transformation.no.expectedScore': number;
  'transformation.log.lowerBound': number;
  'transformation.log.upperBound': number;
  'transformation.log.expectedScore': number;
  'transformation.log_epsilon.lowerBound': number;
  'transformation.log_epsilon.upperBound': number;
  'transformation.log_epsilon.expectedScore': number;
  'transformation.square_root.lowerBound': number;
  'transformation.square_root.upperBound': number;
  'transformation.square_root.expectedScore': number;
  'transformation.cube_root.lowerBound': number;
  'transformation.cube_root.upperBound': number;
  'transformation.cube_root.expectedScore': number;
};
