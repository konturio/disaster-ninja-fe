import { setupTestContext } from '~utils/test_utils/setupTest';
import { LayersOrderManager } from './layersOrder';

/* Setup stage */
const test = setupTestContext(() => {
  return {};
});

class FakeMapWithBaseLayers {
  #baseLayers = [];
  #layers = [];
  constructor(baseLayers) {
    this.#baseLayers = baseLayers;
  }

  once(type, cb) {
    cb();
  }

  getStyle() {
    return {
      layers: [...this.#baseLayers, ...this.#layers],
    };
  }

  setLayers(layers) {
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
  layersOrderManager.init(map as any);

  t.plan(4);

  layersOrderManager.getIdToMountOnTypesTop('fill', (beforeId1) => {
    t.is(beforeId1, undefined);
  });

  layersOrderManager.getIdToMountOnTypesTop('line', (beforeId2) => {
    t.is(beforeId2, undefined);
  });

  layersOrderManager.getIdToMountOnTypesTop('background', (beforeId3) => {
    t.is(beforeId3, undefined);
  });

  layersOrderManager.getIdToMountOnTypesBottom('background', (beforeId) => {
    t.is(beforeId, undefined);
  });
});

test('Returns id of layer with type that must be rendered above passed type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  layersOrderManager.init(map as any);

  map.setLayers([
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
  ]);

  t.plan(4);
  {
    layersOrderManager.getIdToMountOnTypesTop('background', (beforeId) => {
      t.is(
        beforeId,
        'raster-layer',
        'test for the first/bottom type of the type set',
      );
    });

    layersOrderManager.getIdToMountOnTypesBottom('background', (beforeId) => {
      t.is(
        beforeId,
        'background-layer',
        'test to get bottom id of a singular mounted layer',
      );
    });

    layersOrderManager.getIdToMountOnTypesTop('fill', (beforeId) => {
      t.is(
        beforeId,
        'fill-extrusion-layer',
        'test for one of the middle layers',
      );
    });

    layersOrderManager.getIdToMountOnTypesTop('custom', (beforeId) => {
      t.is(beforeId, undefined, 'test for the last/top type of the type set');
    });
  }
});

test('Return correct beforeId when some layer types are missing', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  layersOrderManager.init(map as any);
  map.setLayers([
    { type: 'raster', id: 'raster-layer' },
    { type: 'hillshade', id: 'hillshade-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'symbol', id: 'symbol-layer1' },
  ]);

  t.plan(7);

  layersOrderManager.getIdToMountOnTypesTop('background', (beforeId) => {
    t.is(
      beforeId,
      'raster-layer',
      'test for the first/bottom type of the type set',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('raster', (beforeId) => {
    t.is(
      beforeId,
      'hillshade-layer',
      'test before layer type that goes next in order',
    );
  });

  layersOrderManager.getIdToMountOnTypesBottom('raster', (beforeId) => {
    t.is(
      beforeId,
      'raster-layer',
      'test before layer type that goes next in order',
    );
  });

  layersOrderManager.getIdToMountOnTypesBottom('heatmap', (beforeId) => {
    t.is(
      beforeId,
      'fill-layer',
      'test for mounting layer on type bottom when type was not mounted',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('hillshade', (beforeId) => {
    t.is(
      beforeId,
      'fill-layer',
      'test when theres no layers for the type that goes up in order',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('symbol', (beforeId) => {
    t.is(
      beforeId,
      undefined,
      'test when theres no layers for ANY type that goes up in order',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('custom', (beforeId) => {
    t.is(beforeId, undefined, 'test for the last/top type of the type set');
  });
});

test('Return correct beforeId when some layer types have multiple layers', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  layersOrderManager.init(map as any);
  map.setLayers([
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
  ]);

  t.plan(6);

  layersOrderManager.getIdToMountOnTypesTop('background', (beforeId) => {
    t.is(
      beforeId,
      'raster-layer',
      'test for the first/bottom type of the type set',
    );
  });

  //
  layersOrderManager.getIdToMountOnTypesTop('raster', (beforeId) => {
    t.is(
      beforeId,
      'hillshade-layer-0',
      'test for the type before 2+ layers type',
    );
  });

  layersOrderManager.getIdToMountOnTypesBottom('hillshade', (beforeId) => {
    t.is(
      beforeId,
      'hillshade-layer-0',
      'test to get bottom type when multiple types are mounted',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('hillshade', (beforeId) => {
    t.is(
      beforeId,
      'heatmap-layer',
      'test for the type before single layers type',
    );
  });

  layersOrderManager.getIdToMountOnTypesTop('heatmap', (beforeId) => {
    t.is(beforeId, 'fill-layer', 'test for the type before 2 layers type');
  });

  layersOrderManager.getIdToMountOnTypesTop('custom', (beforeId) => {
    t.is(beforeId, undefined, 'test for the last/top type of the type set');
  });
});
