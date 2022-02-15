import { setupTestContext } from '../../utils/testsUtils/setupTest';
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

test('Return undefined if only basemap layers are awailible', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([
    { type: 'background', id: 'base-line-background' },
    { type: 'fill', id: 'base-fill' },
    { type: 'line', id: 'base-line-top' },
  ]);
  layersOrderManager.init(map as any);

  const beforeId1 = layersOrderManager.getBeforeIdByType('fill');
  t.is(beforeId1, undefined);

  const beforeId2 = layersOrderManager.getBeforeIdByType('line');
  t.is(beforeId2, undefined);

  const beforeId3 = layersOrderManager.getBeforeIdByType('background');
  t.is(beforeId3, undefined);
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

  t.deepEqual(
    {
      background: layersOrderManager.getBeforeIdByType('background'),
      raster: layersOrderManager.getBeforeIdByType('raster'),
      hillshade: layersOrderManager.getBeforeIdByType('hillshade'),
      heatmap: layersOrderManager.getBeforeIdByType('heatmap'),
      fill: layersOrderManager.getBeforeIdByType('fill'),
      'fill-extrusion': layersOrderManager.getBeforeIdByType('fill-extrusion'),
      line: layersOrderManager.getBeforeIdByType('line'),
      circle: layersOrderManager.getBeforeIdByType('circle'),
      symbol: layersOrderManager.getBeforeIdByType('symbol'),
      custom: layersOrderManager.getBeforeIdByType('custom'),
    },
    {
      background: 'background-layer',
      raster: 'raster-layer',
      hillshade: 'hillshade-layer',
      heatmap: 'heatmap-layer',
      fill: 'fill-layer',
      'fill-extrusion': 'fill-extrusion-layer',
      line: 'line-layer',
      circle: 'circle-layer',
      symbol: 'symbol-layer',
      custom: 'custom-layer',
    },
  );
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

  t.is(layersOrderManager.getBeforeIdByType('hillshade'), 'raster-layer');
});
