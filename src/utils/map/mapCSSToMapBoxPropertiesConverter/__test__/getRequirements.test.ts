import { test, expect } from 'vitest';
import { getRequirements } from '../getRequirements';
import { MAP_CSS_MAPBOX } from '../config';
import { mapCSS } from './mockMapCss';

test('Generate requirements from mapCSS', () => {
  const requirements = getRequirements(MAP_CSS_MAPBOX, mapCSS);
  expect(requirements).toMatchSnapshot();
});
