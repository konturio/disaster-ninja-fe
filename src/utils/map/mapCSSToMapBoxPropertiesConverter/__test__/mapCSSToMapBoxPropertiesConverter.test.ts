import { test, expect } from 'vitest';
import { mapCSSToMapBoxProperties } from '../index';
import { mapCSS } from './mockMapCss';

test('Convert mapCSS style to mapBox layers', () => {
  const result = mapCSSToMapBoxProperties(mapCSS);
  expect(result).toMatchSnapshot();
});

test('Not create extra line-offset layers', () => {
  const result = mapCSSToMapBoxProperties({
    color: 'black',
    width: 1,
    opacity: 0.2,
  });
  expect(result.length).toEqual(1);
});
