import { expect, test } from 'vitest';
import { onCalculateSelectedCell } from './utils';
import type { AxisGroup } from '~core/types';

test('onCalculateSelectedCell', () => {
  const xGroups = [
    {
      parent: '["avgmax_ts","one"]',
      selectedQuotient: ['avgmax_ts', 'one'],
    },
    {
      parent: '["count","area_km2"]',
      selectedQuotient: ['count', 'area_km2'],
    },
    {
      parent: '["building_count","area_km2"]',
      selectedQuotient: ['building_count', 'area_km2'],
    },
    {
      parent: '["total_hours","area_km2"]',
      selectedQuotient: ['total_hours', 'area_km2'],
    },
    {
      parent: '["view_count","area_km2"]',
      selectedQuotient: ['view_count', 'area_km2'],
    },
    {
      parent: '["local_hours","area_km2"]',
      selectedQuotient: ['local_hours', 'area_km2'],
    },
    {
      parent: '["days_mintemp_above_25c_1c","one"]',
      selectedQuotient: ['days_mintemp_above_25c_1c', 'one'],
    },
    {
      parent: '["highway_length","area_km2"]',
      selectedQuotient: ['highway_length', 'area_km2'],
    },
    {
      parent: '["herbage","total_road_length"]',
      selectedQuotient: ['herbage', 'total_road_length'],
    },
  ] as AxisGroup[];

  const yGroups = [
    {
      parent: '["avgmax_ts","one"]',
      selectedQuotient: ['avgmax_ts', 'one'],
    },
    {
      parent: '["count","area_km2"]',
      selectedQuotient: ['count', 'area_km2'],
    },
    {
      parent: '["building_count","area_km2"]',
      selectedQuotient: ['building_count', 'area_km2'],
    },
    {
      parent: '["population","area_km2"]',
      selectedQuotient: ['population', 'area_km2'],
    },
    {
      parent: '["total_hours","area_km2"]',
      selectedQuotient: ['total_hours', 'area_km2'],
    },
    {
      parent: '["view_count","area_km2"]',
      selectedQuotient: ['view_count', 'area_km2'],
    },
    {
      parent: '["local_hours","area_km2"]',
      selectedQuotient: ['local_hours', 'area_km2'],
    },
    {
      parent: '["days_mintemp_above_25c_1c","one"]',
      selectedQuotient: ['days_mintemp_above_25c_1c', 'one'],
    },
    {
      parent: '["highway_length","area_km2"]',
      selectedQuotient: ['highway_length', 'area_km2'],
    },
    {
      parent: '["herbage","total_road_length"]',
      selectedQuotient: ['herbage', 'total_road_length'],
    },
  ] as AxisGroup[];

  expect(
    onCalculateSelectedCell(xGroups, yGroups, {
      xNumerator: 'local_hours',
      xDenominator: 'area_km2',
      yNumerator: 'total_hours',
      yDenominator: 'area_km2',
    }),
  ).toEqual({
    x: 5,
    y: 4,
  });

  expect(
    onCalculateSelectedCell(xGroups, yGroups, {
      xNumerator: 'highway_length',
      xDenominator: 'total_road_length',
      yNumerator: 'population',
      yDenominator: 'area_km2',
    }),
  ).toEqual({
    x: -1,
    y: 3,
  });
});
