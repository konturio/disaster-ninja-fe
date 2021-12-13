import test from 'ava';
import { getRequirements } from '../getRequirements';
import { MAP_CSS_MAPBOX } from '../config';
import { mapCSS } from './mockMapCss';

test('Generate requirements from mapCSS', (t) => {
  const requirements = getRequirements(MAP_CSS_MAPBOX, mapCSS);
  t.snapshot(requirements, 'requirements');
});
