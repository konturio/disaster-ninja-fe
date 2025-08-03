/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('@konturio/default-icons', () => ({}), { virtual: true });
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { layersOrderManager } from '~core/logical_layers/utils/layersOrder/layersOrder';
import { GenericRenderer } from './GenericRenderer';

describe('GenericRenderer basemap switching', () => {
  beforeEach(() => {
    mountedLayersAtom.clear.dispatch();
  });

  it('applies new style and remounts other layers', async () => {
    const renderer = new GenericRenderer({ id: 'kontur_lines' });

    const otherLayer = vi.fn();
    mountedLayersAtom.set.dispatch('other', otherLayer as any);

    const map = {
      _loaded: true,
      setStyle: vi.fn(),
      once: vi.fn((event, cb) => {
        if (event === 'styledata') cb();
      }),
      getStyle: vi.fn(() => ({ layers: [] })),
    } as any;

    const state = {
      source: {
        id: 'kontur_lines',
        source: { type: 'maplibre-style-url', urls: ['style.json'] },
      },
      legend: null,
      isVisible: true,
      style: null,
    } as any;

    // prevent real init logic
    const initSpy = vi.spyOn(layersOrderManager, 'init').mockImplementation(() => {});

    await renderer.willMount({ map, state });

    expect(map.setStyle, 'basemap style should update').toHaveBeenCalledWith(
      'style.json',
    );
    expect(
      otherLayer.mock.calls.filter((call) => call[0] === 'disable').length > 0,
      'other layers should remount on style change',
    ).toBe(true);

    initSpy.mockRestore();
  });
});
