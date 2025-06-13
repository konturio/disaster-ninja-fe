import { describe, it, expect, vi } from 'vitest';
import {
  legendToMultivariateStyle,
  mcdaToMultivariateStyle,
} from './bivariateToMultivariate';
import type { BivariateLegend } from '~core/logical_layers/types/legends';
import type { Axis } from '~utils/bivariate';
import type {
  MCDALayerStyle,
  MCDAConfig,
} from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

vi.mock('nanoid', () => ({ nanoid: () => 'abcd' }));
vi.mock('~features/mcda/mcdaConfig', () => {
  return {
    createDefaultMCDAConfig: (overrides?: Partial<MCDAConfig>): MCDAConfig => ({
      version: 4,
      id: `${overrides?.name ?? 'mcda'}_abcd`,
      name: overrides?.name ?? 'mcda',
      layers: overrides?.layers ?? [],
      colors: { type: 'sentiments', parameters: { bad: '#f00', good: '#0f0' } },
    }),
  };
});

describe('bivariateToMultivariate converters', () => {
  it('legendToMultivariateStyle() converts bivariate legend', () => {
    const axis: Axis = {
      id: 'pop_density',
      label: 'Population density',
      quotient: ['population', 'area'],
      steps: [{ value: 0 }, { value: 10 }],
    };
    const legend: BivariateLegend = {
      type: 'bivariate',
      name: 'test-legend',
      axis: { x: axis, y: axis },
      steps: [
        { label: 'A1', color: '#111' },
        { label: 'A2', color: '#222' },
        { label: 'B1', color: '#333' },
        { label: 'B2', color: '#444' },
      ],
    };
    const result = legendToMultivariateStyle(legend);
    expect(result).toMatchObject({
      type: 'multivariate',
      config: {
        id: 'test-legend',
        name: 'test-legend',
        version: 0,
        colors: {
          type: 'bivariate',
          colors: [
            { id: 'A1', color: '#111' },
            { id: 'A2', color: '#222' },
            { id: 'B1', color: '#333' },
            { id: 'B2', color: '#444' },
          ],
        },
        score: { type: 'mcda' },
        base: { type: 'mcda' },
        stepOverrides: {
          scoreSteps: [{ value: 0 }, { value: 10 }],
          baseSteps: [{ value: 0 }, { value: 10 }],
        },
      },
    });
  });

  it('mcdaToMultivariateStyle() converts mcda style', () => {
    const mcda: MCDALayerStyle = {
      type: 'mcda',
      config: {
        version: 4,
        id: 'mcda-style_abcd',
        name: 'mcda-style',
        layers: [],
        colors: {
          type: 'sentiments',
          parameters: { bad: '#f00', good: '#0f0' },
        },
      },
    };
    const result = mcdaToMultivariateStyle(mcda);
    expect(result).toMatchObject({
      type: 'multivariate',
      config: {
        id: 'mcda-style_abcd',
        name: 'mcda-style',
        version: 0,
        colors: {
          type: 'mcda',
          colors: {
            type: 'sentiments',
            parameters: { bad: '#f00', good: '#0f0' },
          },
        },
        score: {
          type: 'mcda',
          config: {
            id: 'mcda-style_abcd',
            name: 'mcda-style',
            version: 4,
            layers: [],
            colors: { type: 'sentiments', parameters: { bad: '#f00', good: '#0f0' } },
          },
        },
      },
    });
  });
});
