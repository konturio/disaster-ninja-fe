import { setupTestContext } from '../../../utils/testsUtils/setupTest';
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

  t.plan(3);

  layersOrderManager.getBeforeIdByType('fill', (beforeId1) => {
    t.is(beforeId1, undefined);
  });

  layersOrderManager.getBeforeIdByType('line', (beforeId2) => {
    t.is(beforeId2, undefined);
  });

  layersOrderManager.getBeforeIdByType('background', (beforeId3) => {
    t.is(beforeId3, undefined);
  });
});

test('Return first layer with same type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);
  map.setLayers([
    { type: 'custom', id: 'custom-layer' },
    { type: 'symbol', id: 'symbol-layer' },
    { type: 'circle', id: 'circle-layer' },
    { type: 'line', id: 'line-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'heatmap', id: 'heatmap-layer' },
    { type: 'hillshade', id: 'hillshade-layer' },
    { type: 'raster', id: 'raster-layer' },
    { type: 'background', id: 'background-layer' },
  ]);

  t.plan(10);

  layersOrderManager.getBeforeIdByType('background', (beforeId) => {
    t.is(beforeId, 'background-layer');
  });

  layersOrderManager.getBeforeIdByType('raster', (beforeId) => {
    t.is(beforeId, 'raster-layer');
  });

  layersOrderManager.getBeforeIdByType('hillshade', (beforeId) => {
    t.is(beforeId, 'hillshade-layer');
  });

  layersOrderManager.getBeforeIdByType('heatmap', (beforeId) => {
    t.is(beforeId, 'heatmap-layer');
  });

  layersOrderManager.getBeforeIdByType('fill', (beforeId) => {
    t.is(beforeId, 'fill-layer');
  });

  layersOrderManager.getBeforeIdByType('fill-extrusion', (beforeId) => {
    t.is(beforeId, 'fill-extrusion-layer');
  });

  layersOrderManager.getBeforeIdByType('line', (beforeId) => {
    t.is(beforeId, 'line-layer');
  });

  layersOrderManager.getBeforeIdByType('circle', (beforeId) => {
    t.is(beforeId, 'circle-layer');
  });

  layersOrderManager.getBeforeIdByType('symbol', (beforeId) => {
    t.is(beforeId, 'symbol-layer');
  });

  layersOrderManager.getBeforeIdByType('custom', (beforeId) => {
    t.is(beforeId, 'custom-layer');
  });
});

test('Return first layer with prev type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);
  map.setLayers([
    { type: 'custom', id: 'custom-layer' },
    { type: 'symbol', id: 'symbol-layer' },
    { type: 'circle', id: 'circle-layer' },
    { type: 'line', id: 'line-layer' },
    { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
    { type: 'fill', id: 'fill-layer' },
    { type: 'heatmap', id: 'heatmap-layer' },
    { type: 'raster', id: 'raster-layer' },
    { type: 'background', id: 'background-layer' },
  ]);

  t.plan(1);
  layersOrderManager.getBeforeIdByType('hillshade', (beforeId) =>
    t.is(beforeId, 'raster-layer'),
  );
});
