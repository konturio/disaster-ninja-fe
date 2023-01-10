import { expect, test } from 'vitest';
import { onCalculateSelectedCell, selectQuotientInGroupByNumDen } from './utils';
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

test('selectQuotientInGroupByNumDen', () => {
  const groups: AxisGroup[] = [
    {
      parent: '["population","area_km2"]',
      quotients: [
        ['population', 'area_km2'],
        ['covid19_confirmed', 'area_km2'],
        ['gdp', 'area_km2'],
        ['population_prev', 'area_km2'],
        ['mandays_maxtemp_over_32c_1c', 'area_km2'],
        ['man_distance_to_bomb_shelters', 'area_km2'],
      ],
      selectedQuotient: ['covid19_confirmed', 'area_km2'],
    },
  ];
  const groupAfterSelection = selectQuotientInGroupByNumDen(
    groups,
    'population',
    'area_km2',
  );
  expect(groupAfterSelection[0].selectedQuotient).toEqual(['population', 'area_km2']);

  const groupAfterWrongSelection = selectQuotientInGroupByNumDen(
    groups,
    'population',
    'one',
  );
  expect(groupAfterWrongSelection[0].selectedQuotient).toEqual([
    'covid19_confirmed',
    'area_km2',
  ]);
});
