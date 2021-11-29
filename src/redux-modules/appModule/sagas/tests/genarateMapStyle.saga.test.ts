import { createSagaTestEngine } from 'redux-saga-test-engine';
import { select, take } from 'redux-saga/effects';
import { setupTestContext } from '../../../../utils/testsUtils/setupTest';
import {
  convertColorWithOpacity,
  styleGeneration,
} from '../generateMapStyle.saga';
import { setLegendCells, setMatrixSelection } from '../../actions';
import * as selectors from '../../selectors';

/* Corners */
const a1Color = '#a1a1a1';
const c1Color = '#c1c1c1';
const a3Color = '#a3a3a3';
const c3Color = '#c3c3c3';

/* Setup stage */
const test = setupTestContext(() => {
  function extractOpacityFromRGBA(rgbaString: string) {
    if (rgbaString.indexOf('rgba') === -1) {
      throw new Error('extracted string is not in rgba format!');
    } else {
      const opacity = rgbaString.replace(/^.*,(.+)\)/, '$1');
      return parseFloat(opacity);
    }
  }

  const collectEffects = createSagaTestEngine();
  const actualEffects = collectEffects(
    styleGeneration,
    [
      [
        select(selectors.xNumerators),
        [
          {
            numeratorId: 'testXNumerator',
            selectedDenominator: 'testDenominator',
          },
        ],
      ],
      [
        select(selectors.yNumerators),
        [
          {
            numeratorId: 'testYNumerator',
            selectedDenominator: 'testDenominator',
          },
        ],
      ],
      [
        select(selectors.stats),
        {
          axis: [
            {
              steps: [],
              quotient: ['testXNumerator', 'testDenominator'],
            },
            {
              steps: [],
              quotient: ['testYNumerator', 'testDenominator'],
            },
          ],
          indicators: [
            {
              name: 'testXNumerator',
              direction: [['xNumeratorLow'], ['xNumeratorHigh']],
            },
            {
              name: 'testYNumerator',
              direction: [['yNumeratorLow'], ['yNumeratorHigh']],
            },
          ],
          colors: {
            combinations: [
              {
                color: a1Color,
                corner: ['xNumeratorLow', 'yNumeratorLow'],
              },
              {
                color: c1Color,
                corner: ['xNumeratorHigh', 'yNumeratorLow'],
              },
              {
                color: a3Color,
                corner: ['xNumeratorLow', 'yNumeratorHigh'],
              },
              {
                color: c3Color,
                corner: ['xNumeratorHigh', 'yNumeratorHigh'],
              },
            ],
          },
          meta: {
            max_zoom: 8,
            min_zoom: 0,
          },
        },
      ],
      [take(setLegendCells.getType()), {}],
      [select(selectors.apiConfig), { TILES_API: '/tiles/stats/' }],
    ],
    setMatrixSelection('testXNumerator', 'testYNumerator'),
  );

  return {
    extractOpacityFromRGBA,
    theme: actualEffects[0].payload.action.payload,
  };
});

// we have to take in account here that X and Y axises are swapped

test('check bottom left corner', (t) => {
  const color = a1Color;
  t.is(t.context.theme[0].id, 'A1');
  t.is(t.context.theme[0].color, convertColorWithOpacity(color));
});

test('check bottom mid corner', (t) => {
  const color = '#a2a2a2';
  t.is(t.context.theme[1].id, 'A2');
  t.is(t.context.theme[1].color, convertColorWithOpacity(color));
});

test('check bottom right corner', (t) => {
  const color = a3Color;
  t.is(t.context.theme[2].id, 'A3');
  t.is(t.context.theme[2].color, convertColorWithOpacity(color));
});

test('check mid left corner', (t) => {
  const color = '#b1b1b1';
  t.is(t.context.theme[3].id, 'B1');
  t.is(t.context.theme[3].color, convertColorWithOpacity(color));
});

test('check mid center corner', (t) => {
  const color = '#b2b2b2';
  t.is(t.context.theme[4].id, 'B2');
  t.is(t.context.theme[4].color, convertColorWithOpacity(color));
});

test('check mid right corner', (t) => {
  const color = '#b3b3b3';
  t.is(t.context.theme[5].id, 'B3');
  t.is(t.context.theme[5].color, convertColorWithOpacity(color));
});

test('check top left corner', (t) => {
  const color = c1Color;
  t.is(t.context.theme[6].id, 'C1');
  t.is(t.context.theme[6].color, convertColorWithOpacity(color));
});

test('check top center corner', (t) => {
  const color = '#c2c2c2';
  t.is(t.context.theme[7].id, 'C2');
  t.is(t.context.theme[7].color, convertColorWithOpacity(color));
});

test('check top right corner', (t) => {
  const color = c3Color;
  t.is(t.context.theme[8].id, 'C3');
  t.is(t.context.theme[8].color, convertColorWithOpacity(color));
});

test('opacity check', (t) => {
  const { extractOpacityFromRGBA } = t.context;
  t.true(extractOpacityFromRGBA(t.context.theme[0].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[1].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[2].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[3].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[4].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[5].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[6].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[7].color) === 0.5);
  t.true(extractOpacityFromRGBA(t.context.theme[8].color) === 0.5);
});
