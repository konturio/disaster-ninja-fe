/**
 * @vitest-environment happy-dom
 */
import { test, expect } from 'vitest';
import { createMapAtom } from '~utils/atoms';
import { LayersOrderManager } from './layersOrder';
import type { AsyncState } from '~core/logical_layers/types/asyncState';
import type { LayerSettings } from '~core/logical_layers/types/settings';

function generateFakeSettingsAndParentsIds() {
  const layersSettingsAtom = createMapAtom(new Map<string, AsyncState<LayerSettings>>());
  const layersParentsIds: Map<string, string> = new Map();
  return { layersSettingsAtom, layersParentsIds };
}
function getDummySettings(id: string, category?: LayerSettings['category']) {
  const r: AsyncState<LayerSettings, Error> = {
    data: {
      id: id,
      name: id + '-dummy-layer',
      ownedByUser: false,
      boundaryRequiredForRetrieval: false,
      category,
    },
    error: null,
    isLoading: false,
  };
  return r;
}

class FakeMapWithBaseLayers {
  #baseLayers = new Array<{
    type: string;
    id: string;
  }>();

  #layers = new Array<{
    type: string;
    id: string;
  }>();

  constructor(baseLayers: Array<{ type: string; id: string }>) {
    this.#baseLayers = baseLayers;
  }

  once(type: string, cb: () => void) {
    cb();
  }

  getStyle() {
    return {
      layers: [...this.#baseLayers, ...this.#layers],
    };
  }

  setLayers(layers: Array<{ type: string; id: string }>) {
    this.#layers = layers;
  }
}

/* Test cases */

test('Return undefined if only base map layers are available', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);

  const { layersParentsIds, layersSettingsAtom } = generateFakeSettingsAndParentsIds();
  // Mock settings for testing layer
  layersParentsIds.set('testing-layer', 'testing-layer');
  layersSettingsAtom.set.dispatch('testing-layer', getDummySettings('testing-layer'));
  // Apply mocked settings
  layersOrderManager.init(map as any, layersParentsIds, layersSettingsAtom);

  expect.assertions(4);

  layersOrderManager.getIdToMountOnTypesTop('fill', 'testing-layer', (beforeId1) => {
    expect(beforeId1).toBeUndefined();
  });

  layersOrderManager.getIdToMountOnTypesTop('line', 'testing-layer', (beforeId2) => {
    expect(beforeId2).toBeUndefined();
  });

  layersOrderManager.getIdToMountOnTypesTop(
    'background',
    'testing-layer',
    (beforeId3) => {
      expect(beforeId3).toBeUndefined();
    },
  );

  layersOrderManager.getIdToMountOnTypesBottom(
    'background',
    'testing-layer',
    (beforeId) => {
      expect(beforeId).toBeUndefined();
    },
  );
});

test('Returns id of layer with type that must be rendered above passed type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  const layersSet = [
    { type: 'background', id: 'background-layer' },
    { type: 'raster', id: 'raster-layer' },
    { type: 'hillshade', id: 'hillshade-layer' },
    { type: 'heatmap', id: 'heatmap-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'line', id: 'line-layer' },
    { type: 'circle', id: 'circle-layer' },
    { type: 'symbol', id: 'symbol-layer' },
    { type: 'custom', id: 'custom-layer' },
  ];

  const { layersParentsIds, layersSettingsAtom } = generateFakeSettingsAndParentsIds();
  // Mock settings for set of dummy layers
  layersSet.forEach((layer) => {
    layersSettingsAtom.set.dispatch(layer.id, getDummySettings(layer.id));
    layersParentsIds.set(layer.id, layer.id);
  });
  // Mock settings for testing layer
  layersParentsIds.set('testing-layer', 'testing-layer');
  layersSettingsAtom.set.dispatch('testing-layer', getDummySettings('testing-layer'));
  // Apply mocked settings
  layersOrderManager.init(map as any, layersParentsIds, layersSettingsAtom);
  map.setLayers(layersSet);

  expect.assertions(4);
  {
    layersOrderManager.getIdToMountOnTypesTop(
      'background',
      'testing-layer',
      (beforeId) => {
        expect(beforeId, 'test for the first/bottom type of the type set').toBe(
          'raster-layer',
        );
      },
    );

    layersOrderManager.getIdToMountOnTypesBottom(
      'background',
      'testing-layer',
      (beforeId) => {
        expect(beforeId, 'test to get bottom id of a singular mounted layer').toBe(
          'background-layer',
        );
      },
    );

    layersOrderManager.getIdToMountOnTypesTop('fill', 'testing-layer', (beforeId) => {
      // prettier-ignore
      expect(
        beforeId,
        'test for one of the middle layers'
      ).toBe(
        'fill-extrusion-layer',
      );
    });

    layersOrderManager.getIdToMountOnTypesTop('custom', 'testing-layer', (beforeId) => {
      expect(beforeId, 'test for the last/top type of the type set').toBeUndefined();
    });
  }
});

test('Return correct beforeId when some layer types are missing', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  const layersSet = [
    { type: 'raster', id: 'raster-layer' },
    { type: 'hillshade', id: 'hillshade-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'symbol', id: 'symbol-layer1' },
  ];

  const { layersParentsIds, layersSettingsAtom } = generateFakeSettingsAndParentsIds();
  // Mock settings for set of dummy layers
  layersSet.forEach((layer) => {
    layersSettingsAtom.set.dispatch(layer.id, getDummySettings(layer.id));
    layersParentsIds.set(layer.id, layer.id);
  });
  // Mock settings for testing layer
  layersParentsIds.set('testing-layer', 'testing-layer');
  layersSettingsAtom.set.dispatch('testing-layer', getDummySettings('testing-layer'));
  // Apply mocked settings
  layersOrderManager.init(map as any, layersParentsIds, layersSettingsAtom);

  map.setLayers(layersSet);

  expect.assertions(7);

  layersOrderManager.getIdToMountOnTypesTop('background', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the first/bottom type of the type set'
    ).toBe('raster-layer')
  });

  layersOrderManager.getIdToMountOnTypesTop('raster', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test before layer type that goes next in order',
    ).toBe('hillshade-layer');
  });

  layersOrderManager.getIdToMountOnTypesBottom('raster', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test before layer type that goes next in order'
    ).toBe('raster-layer');
  });

  layersOrderManager.getIdToMountOnTypesBottom('heatmap', 'testing-layer', (beforeId) => {
    expect(
      beforeId,
      'test for mounting layer on type bottom when type was not mounted',
    ).toBe('fill-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('hillshade', 'testing-layer', (beforeId) => {
    expect(
      beforeId,
      'test when theres no layers for the type that goes up in order',
    ).toBe('fill-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('symbol', 'testing-layer', (beforeId) => {
    expect(
      beforeId,
      'test when theres no layers for ANY type that goes up in order',
    ).toBeUndefined();
  });

  layersOrderManager.getIdToMountOnTypesTop('custom', 'testing-layer', (beforeId) => {
    expect(beforeId, 'test for the last/top type of the type set').toBeUndefined();
  });
});

test('Return correct beforeId when some layer types have multiple layers', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  const layersSet = [
    { type: 'background', id: 'background-layer' },
    { type: 'raster', id: 'raster-layer' },
    { type: 'raster', id: 'satelite-shots' },
    { type: 'hillshade', id: 'hillshade-layer-0' },
    { type: 'hillshade', id: 'hillshade-layer-1' },
    { type: 'hillshade', id: 'hillshade-layer-2' },
    { type: 'heatmap', id: 'heatmap-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill', id: 'fill-layer-top' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer-1' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer-2' },
  ];

  const { layersParentsIds, layersSettingsAtom } = generateFakeSettingsAndParentsIds();
  // Mock settings for set of dummy layers
  layersSet.forEach((layer) => {
    layersSettingsAtom.set.dispatch(layer.id, getDummySettings(layer.id));
    layersParentsIds.set(layer.id, layer.id);
  });
  // Mock settings for testing layer
  layersParentsIds.set('testing-layer', 'testing-layer');
  layersSettingsAtom.set.dispatch('testing-layer', getDummySettings('testing-layer'));
  // Apply mocked settings
  layersOrderManager.init(map as any, layersParentsIds, layersSettingsAtom);

  map.setLayers(layersSet);

  expect.assertions(6);

  layersOrderManager.getIdToMountOnTypesTop('background', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the first/bottom type of the type set'
    ).toBe('raster-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('raster', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the type before 2+ layers type')
      .toBe(
        'hillshade-layer-0',
      );
  });

  layersOrderManager.getIdToMountOnTypesBottom(
    'hillshade',
    'testing-layer',
    (beforeId) => {
      expect(beforeId, 'test to get bottom type when multiple types are mounted').toBe(
        'hillshade-layer-0',
      );
    },
  );

  layersOrderManager.getIdToMountOnTypesTop('hillshade', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the type before single layers type'
    ).toBe('heatmap-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('heatmap', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the type before 2 layers type')
      .toBe('fill-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('custom', 'testing-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test for the last/top type of the type set'
    ).toBeUndefined()
  });
});

test('Return correct beforeId when some layer types have multiple layers', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  const layersSet = [
    { type: 'background', id: 'background-layer-fallback', category: 'base' },
    { type: 'background', id: 'background-layer', category: 'base' },

    { type: 'raster', id: 'raster-layer', category: 'overlay' },
    { type: 'raster', id: 'satelite-shots' },

    { type: 'fill', id: 'fill-layer', category: 'base' },
    { type: 'fill', id: 'fill-layer-top', category: 'overlay' },

    { type: 'custom', id: 'custom-layer', category: 'overlay' },
  ];

  const { layersParentsIds, layersSettingsAtom } = generateFakeSettingsAndParentsIds();
  // Mock settings for set of dummy layers
  layersSet.forEach((layer) => {
    layersSettingsAtom.set.dispatch(
      layer.id,
      getDummySettings(layer.id, layer.category as LayerSettings['category']),
    );
    layersParentsIds.set(layer.id, layer.id);
  });
  // Mock settings for testing layers
  layersParentsIds.set('no-category-layer', 'no-category-layer');
  layersSettingsAtom.set.dispatch(
    'no-category-layer',
    getDummySettings('no-category-layer'),
  );
  layersParentsIds.set('base-layer', 'base-layer');
  layersSettingsAtom.set.dispatch('base-layer', getDummySettings('base-layer', 'base'));
  layersParentsIds.set('overlay-layer', 'overlay-layer');
  layersSettingsAtom.set.dispatch(
    'overlay-layer',
    getDummySettings('overlay-layer', 'overlay'),
  );
  // Apply mocked settings
  layersOrderManager.init(map as any, layersParentsIds, layersSettingsAtom);

  map.setLayers(layersSet);

  expect.assertions(7);

  layersOrderManager.getIdToMountOnTypesBottom(
    'background',
    'no-category-layer',
    (beforeId) => {
      // prettier-ignore
      expect(
        beforeId,
        'test to mount on top of background layers of base category but under next (higher) type'
      ).toBe('raster-layer');
    },
  );

  layersOrderManager.getIdToMountOnTypesBottom('background', 'base-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test to mount base background layer under all other bg layers'
    ).toBe('background-layer-fallback');
  });

  layersOrderManager.getIdToMountOnTypesBottom(
    'background',
    'overlay-layer',
    (beforeId) => {
      // prettier-ignore
      expect(
        beforeId,
        'test to mount overlay background layer under next type'
      ).toBe('raster-layer');
    },
  );

  layersOrderManager.getIdToMountOnTypesTop('raster', 'overlay-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test to mount overlay raster layer under raser layer without category'
    ).toBe('satelite-shots');
  });

  layersOrderManager.getIdToMountOnTypesTop('raster', 'no-category-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test to mount no category raster layer under next type and over all other raster layers'
    ).toBe('fill-layer');
  });

  layersOrderManager.getIdToMountOnTypesTop('custom', 'base-layer', (beforeId) => {
    // prettier-ignore
    expect(
      beforeId,
      'test to mount base custom layer under any presented custom layers but over layers of lower type'
    ).toBe('custom-layer');
  });

  layersOrderManager.getIdToMountOnTypesBottom(
    'custom',
    'no-category-layer',
    (beforeId) => {
      // prettier-ignore
      expect(
        beforeId,
        'test to mount custom layer over custom layers with any category'
      ).toBe(undefined);
    },
  );
});
