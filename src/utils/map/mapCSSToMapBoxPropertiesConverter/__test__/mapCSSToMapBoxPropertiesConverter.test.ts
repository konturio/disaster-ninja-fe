import test from 'ava';
import { mapCSSToMapBoxProperties } from '../index';
import { mapCSS } from './mockMapCss';

test('Convert mapCSS style to mapBox layers', (t) => {
  const result = mapCSSToMapBoxProperties(mapCSS);
  t.snapshot(result, 'mapcss');
});

test('Not create extra line-offset layers', (t) => {
  const result = mapCSSToMapBoxProperties({
    color: 'black',
    width: 1,
    opacity: 0.2,
  });
  t.is(result.length, 1);
});
