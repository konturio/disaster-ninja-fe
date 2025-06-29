import { test, expect } from 'vitest';

if (!globalThis.dispatchEvent) {
  globalThis.dispatchEvent = () => {};
}
if (!globalThis.CustomEvent) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.CustomEvent = class CustomEvent<T = any> {
    constructor(
      public type: string,
      public init?: CustomEventInit<T>,
    ) {}
  } as any;
}

test('enables layer on focused geometry update', async () => {
  const { store } = await import('~core/store/store');
  const { enabledLayersAtom } = await import('~core/logical_layers/atoms/enabledLayers');
  const { focusedGeometryAtom } = await import('~core/focused_geometry/model');
  const { FOCUSED_GEOMETRY_LOGICAL_LAYER_ID } = await import(
    '~core/focused_geometry/constants'
  );
  const { initFocusedGeometryLayer } = await import('../index');
  const { Feature } = await import('~utils/geoJSON/helpers');

  initFocusedGeometryLayer();
  store.dispatch(enabledLayersAtom.delete(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID));
  expect(enabledLayersAtom.getState().has(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID)).toBe(false);

  store.dispatch(
    focusedGeometryAtom.setFocusedGeometry(
      { type: 'uploaded' },
      new Feature({ geometry: { type: 'Point', coordinates: [0, 0] } }),
    ),
  );
  expect(enabledLayersAtom.getState().has(FOCUSED_GEOMETRY_LOGICAL_LAYER_ID)).toBe(true);
});
