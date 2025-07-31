import { vi, test, expect, beforeEach } from 'vitest';
vi.mock('~core/metrics/dispatch', () => ({
  dispatchMetricsEvent: vi.fn(),
  dispatchMetricsEventOnce: vi.fn(),
}));

import * as mapPos from '~core/shared_state/currentMapPosition';
import { selectLocationItemAction } from '../searchLocationAtoms';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { store } from '~core/store/store';

const ctx = store.v3ctx;
import type { Feature } from 'geojson';

const bbox = [0, 0, 1, 1] as const;
const feature: Feature = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [0, 0] },
  properties: { bbox, display_name: 'point' },
};

const spyBbox = vi.spyOn(mapPos, 'setCurrentMapBbox');
const spyFocus = vi.spyOn(mapPos, 'focusOnGeometry');
const spySetFocused = vi.spyOn(focusedGeometryAtom.setFocusedGeometry, 'v3action');

beforeEach(async () => {
  vi.clearAllMocks();
  await Promise.resolve();
});

test('selectLocationItemAction focuses geometry and sets bbox', async () => {
  selectLocationItemAction(ctx, feature as any);
  await Promise.resolve();

  expect(spyBbox).toHaveBeenCalled();
  expect(spyBbox.mock.calls[0][1]).toEqual(bbox);
  expect(spySetFocused).toHaveBeenCalled();
  expect(spySetFocused.mock.calls[0][1]).toEqual({
    source: { type: 'custom' },
    geometry: feature,
  });
  expect(spyFocus).toHaveBeenCalled();
});

test('selectLocationItemAction without geometry', () => {
  const item = { properties: { bbox: [1, 2, 3, 4] } } as any;
  selectLocationItemAction(ctx, item);
  expect(spyBbox).toHaveBeenCalled();
  expect(spyBbox.mock.calls.at(-1)?.[1]).toEqual([1, 2, 3, 4]);
  expect(spySetFocused).not.toHaveBeenCalled();
  expect(spyFocus).not.toHaveBeenCalled();
});
