import { vi, test, expect, beforeEach } from 'vitest';
vi.mock('~core/metrics/dispatch', () => ({
  dispatchMetricsEvent: vi.fn(),
  dispatchMetricsEventOnce: vi.fn(),
}));
vi.mock('../searchLocationAtoms', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { action } = require('@reatom/framework');
  return { selectLocationItemAction: action(() => {}) };
});
vi.mock('../searchMcdaAtoms', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { action } = require('@reatom/framework');
  return { selectMCDAItemAction: action(() => {}), isMCDASearchEnabled: false };
});

import { store } from '~core/store/store';
import { itemSelectAction } from '../searchAtoms';
import { searchHighlightedGeometryAtom } from '../atoms/highlightedGeometry';
import type { Feature } from 'geojson';

const ctx = store.v3ctx;

const feature: Feature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: { osm_id: 1, display_name: 'point', bbox: [0, 0, 1, 1] },
};

beforeEach(() => {
  searchHighlightedGeometryAtom(ctx, { type: 'FeatureCollection', features: [] });
});

test('itemSelectAction clears highlight geometry', () => {
  itemSelectAction(ctx, { ...feature, source: 'locations', name: 'p' } as any);
  expect(ctx.get(searchHighlightedGeometryAtom)).toEqual({
    type: 'FeatureCollection',
    features: [],
  });
});
