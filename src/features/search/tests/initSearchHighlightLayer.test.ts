import { vi, test, expect, beforeEach } from 'vitest';
vi.mock('~core/store/store', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createStore } = require('@reatom/core-v2');
  return { store: createStore() };
});

import { store } from '~core/store/store';
const ctx = store.v3ctx;

const addAboveLayerWithSameType = vi.fn();
vi.mock('~core/logical_layers', () => ({
  layerByOrder: () => ({ addAboveLayerWithSameType }),
}));

// eslint-disable-next-line no-var
var willMount: any;
// eslint-disable-next-line no-var
var willUnMount: any;
// eslint-disable-next-line no-var
var willSourceUpdate: any;
// eslint-disable-next-line no-var
var rendererMock: any;
vi.mock('../renderers/SearchHighlightRenderer', () => {
  willMount = vi.fn();
  willUnMount = vi.fn();
  willSourceUpdate = vi.fn();
  rendererMock = vi.fn().mockImplementation(() => ({
    willMount,
    willUnMount,
    willSourceUpdate,
  }));
  return { SearchHighlightRenderer: rendererMock };
});

beforeEach(() => {
  vi.clearAllMocks();
});

import { currentMapAtom } from '~core/shared_state';
import { searchHighlightedGeometryAtom } from '../atoms/highlightedGeometry';
import { initSearchHighlightLayer } from '../initSearchHighlightLayer';

test.skip('initSearchHighlightLayer mounts and cleans up', async () => {
  const map = {
    addSource: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    getSource: vi.fn(() => ({ setData: vi.fn() })),
  };
  currentMapAtom.setMap.v3action(ctx, map as any);
  ctx.get(currentMapAtom.v3atom);
  await Promise.resolve();

  const cleanup = initSearchHighlightLayer();
  expect(rendererMock).toHaveBeenCalled();
  expect(typeof cleanup).toBe('function');

  cleanup();
  expect(willUnMount).toHaveBeenCalled();
});
