import { expect, test } from 'vitest';
import { analyticsToCsv } from './toCsv';
import type { AnalyticsData } from '~core/types';

test('analyticsToCsv converts analytics data to csv', () => {
  const data: AnalyticsData[] = [
    {
      formula: 'f1',
      value: 10,
      unit: { id: 'u1', shortName: 'km', longName: 'kilometers' },
      prefix: '',
      xlabel: 'Population',
      ylabel: 'people',
    },
  ];
  const csv = analyticsToCsv(data);
  expect(csv).toContain('xlabel,ylabel,prefix,value,unit,formula');
  expect(csv).toContain('Population,people,,10,km,f1');
});
