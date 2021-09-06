import { createSagaTestEngine } from 'redux-saga-test-engine';
import { select, take } from 'redux-saga/effects';
import {
  convertColorWithOpacity,
  styleGeneration,
} from '../generateMapStyle.saga';
import { setLegendCells, setMatrixSelection } from '../../actions';
import * as selectors from '../../selectors';

const a1Color = '#a1a1a1';
const a2Color = '#a2a2a2';
const a3Color = '#a3a3a3';
const b1Color = '#b1b1b1';
const b2Color = '#b2b2b2';
const b3Color = '#b3b3b3';
const c1Color = '#c1c1c1';
const c2Color = '#c2c2c2';
const c3Color = '#c3c3c3';

function extractOpacityFromRGBA(rgbaString: string) {
  if (rgbaString.indexOf('rgba') === -1) {
    throw new Error('extracted string is not in rgba format!');
  } else {
    const opacity = rgbaString.replace(/^.*,(.+)\)/, '$1');
    return parseFloat(opacity);
  }
}

// we have to take in account here that X and Y axises are swapped

describe('map and legend colors generation test', () => {
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

  const theme = actualEffects[0].payload.action.payload;

  it('check bottom left corner', () => {
    expect(theme[0].id).toEqual('A1');
    expect(theme[0].color).toEqual(convertColorWithOpacity(a1Color));
  });

  it('check bottom mid corner', () => {
    expect(theme[1].id).toEqual('A2');
    expect(theme[1].color).toEqual(convertColorWithOpacity(a2Color));
  });

  it('check bottom right corner', () => {
    expect(theme[2].id).toEqual('A3');
    expect(theme[2].color).toEqual(convertColorWithOpacity(a3Color));
  });

  it('check mid left corner', () => {
    expect(theme[3].id).toEqual('B1');
    expect(theme[3].color).toEqual(convertColorWithOpacity(b1Color));
  });

  it('check mid center corner', () => {
    expect(theme[4].id).toEqual('B2');
    expect(theme[4].color).toEqual(convertColorWithOpacity(b2Color));
  });

  it('check mid right corner', () => {
    expect(theme[5].id).toEqual('B3');
    expect(theme[5].color).toEqual(convertColorWithOpacity(b3Color));
  });

  it('check top left corner', () => {
    expect(theme[6].id).toEqual('C1');
    expect(theme[6].color).toEqual(convertColorWithOpacity(c1Color));
  });

  it('check top center corner', () => {
    expect(theme[7].id).toEqual('C2');
    expect(theme[7].color).toEqual(convertColorWithOpacity(c2Color));
  });

  it('check top right corner', () => {
    expect(theme[8].id).toEqual('C3');
    expect(theme[8].color).toEqual(convertColorWithOpacity(c3Color));
  });

  it('opacity check', () => {
    expect(extractOpacityFromRGBA(theme[0].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[1].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[2].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[3].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[4].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[5].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[6].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[7].color) === 0.5);
    expect(extractOpacityFromRGBA(theme[8].color) === 0.5);
  });
});
