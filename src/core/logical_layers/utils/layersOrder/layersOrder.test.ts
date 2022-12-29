import { test, expect } from 'vitest';
import { LayerCategory, LayersOrderManager, LayersType } from './layersOrder';
import type { AsyncState } from '~core/logical_layers/types/asyncState';
import type { LayerSettings } from '~core/logical_layers/types/settings';

const mountedLayersExample = {
  background: {
    base: {},
    overlay: {},
    undefined: {},
    // undefined: {}
  },
  circle: {
    base: {},
    undefined: {},
  },
  fill: {
    base: {},
    overlay: {},
  },
};

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

// test('Return undefined if only base map layers are available', (t) => {
//   const layersOrderManager = new LayersOrderManager();
//   const map = new FakeMapWithBaseLayers([
//     { type: 'background', id: 'base-line-background' },
//     { type: 'fill', id: 'base-fill' },
//     { type: 'line', id: 'base-line-top' },
//   ]);
//   layersOrderManager.init(map as any);

//   expect.assertions(4);

//   layersOrderManager.getIdToMountOnTypesTop('fill', '', (beforeId1) => {
//     expect(beforeId1).toBeUndefined();
//   });

//   layersOrderManager.getIdToMountOnTypesTop('line', '', (beforeId2) => {
//     expect(beforeId2).toBeUndefined();
//   });

//   layersOrderManager.getIdToMountOnTypesTop('background', '', (beforeId3) => {
//     expect(beforeId3).toBeUndefined();
//   });

//   layersOrderManager.getIdToMountOnTypesBottom('background', '', (beforeId) => {
//     expect(beforeId).toBeUndefined();
//   });
// });

test('Returns id of layer with type that must be rendered above passed type', (t) => {
  const layersOrderManager = new LayersOrderManager();
  const map = new FakeMapWithBaseLayers([]);
  layersOrderManager.init(map as any);
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
  map.setLayers(layersSet);
  const layersSettings: Map<string, AsyncState<LayerSettings, Error>> = new Map();
  const layersParentsIds: Map<string, string> = new Map();
  // Mock settings for set of dummy layers
  layersSet.forEach((layer) => {
    layersSettings.set(layer.id, {
      data: {
        id: layer.id,
        name: '',
        ownedByUser: false,
        boundaryRequiredForRetrieval: false,
      },
      error: null,
      isLoading: false,
    });
    layersParentsIds.set(layer.id, layer.id);
  });
  // Mock settings for testing layer
  layersParentsIds.set('bg-test', 'bg-test');
  layersSettings.set('bg-test', {
    data: {
      id: 'bg-test',
      name: '',
      ownedByUser: false,
      boundaryRequiredForRetrieval: false,
    },
    error: null,
    isLoading: false,
  });
  // Apply mocked settings
  layersOrderManager._initForTests(layersSettings, layersParentsIds);

  expect.assertions(4);
  {
    layersOrderManager.getIdToMountOnTypesTop('background', 'bg-test', (beforeId) => {
      expect(beforeId, 'test for the first/bottom type of the type set').toBe(
        'raster-layer',
      );
    });

    layersOrderManager.getIdToMountOnTypesBottom('background', '', (beforeId) => {
      expect(beforeId, 'test to get bottom id of a singular mounted layer').toBe(
        'background-layer',
      );
    });

    layersOrderManager.getIdToMountOnTypesTop('fill', '', (beforeId) => {
      // prettier-ignore
      expect(
        beforeId,
        'test for one of the middle layers'
      ).toBe(
        'fill-extrusion-layer',
      );
    });

    layersOrderManager.getIdToMountOnTypesTop('custom', '', (beforeId) => {
      expect(beforeId, 'test for the last/top type of the type set').toBeUndefined();
    });
  }
});

// test('Return correct beforeId when some layer types are missing', (t) => {
//   const layersOrderManager = new LayersOrderManager();
//   const map = new FakeMapWithBaseLayers([]);
//   layersOrderManager.init(map as any);
//   map.setLayers([
//     { type: 'raster', id: 'raster-layer' },
//     { type: 'hillshade', id: 'hillshade-layer' },
//     { type: 'fill', id: 'fill-layer' },
//     { type: 'fill-extrusion', id: 'fill-extrusion-layer' },
//     { type: 'symbol', id: 'symbol-layer1' },
//   ]);

//   expect.assertions(7);

//   layersOrderManager.getIdToMountOnTypesTop('background', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the first/bottom type of the type set'
//     ).toBe('raster-layer')
//   });

//   layersOrderManager.getIdToMountOnTypesTop('raster', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test before layer type that goes next in order',
//     ).toBe('hillshade-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesBottom('raster', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test before layer type that goes next in order'
//     ).toBe('raster-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesBottom('heatmap', '', (beforeId) => {
//     expect(
//       beforeId,
//       'test for mounting layer on type bottom when type was not mounted',
//     ).toBe('fill-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('hillshade', '', (beforeId) => {
//     expect(
//       beforeId,
//       'test when theres no layers for the type that goes up in order',
//     ).toBe('fill-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('symbol', '', (beforeId) => {
//     expect(
//       beforeId,
//       'test when theres no layers for ANY type that goes up in order',
//     ).toBeUndefined();
//   });

//   layersOrderManager.getIdToMountOnTypesTop('custom', '', (beforeId) => {
//     expect(
//       beforeId,
//       'test for the last/top type of the type set',
//     ).toBeUndefined();
//   });
// });

// test('Return correct beforeId when some layer types have multiple layers', (t) => {
//   const layersOrderManager = new LayersOrderManager();
//   const map = new FakeMapWithBaseLayers([]);
//   layersOrderManager.init(map as any);
//   map.setLayers([
//     { type: 'background', id: 'background-layer' },
//     { type: 'raster', id: 'raster-layer' },
//     { type: 'raster', id: 'satelite-shots' },
//     { type: 'hillshade', id: 'hillshade-layer-0' },
//     { type: 'hillshade', id: 'hillshade-layer-1' },
//     { type: 'hillshade', id: 'hillshade-layer-2' },
//     { type: 'heatmap', id: 'heatmap-layer' },
//     { type: 'fill', id: 'fill-layer' },
//     { type: 'fill', id: 'fill-layer-top' },
//     { type: 'fill-extrusion', id: 'fill-extrusion-layer-1' },
//     { type: 'fill-extrusion', id: 'fill-extrusion-layer-2' },
//   ]);

//   expect.assertions(6);

//   layersOrderManager.getIdToMountOnTypesTop('background', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the first/bottom type of the type set'
//     ).toBe('raster-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('raster', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the type before 2+ layers type')
//       .toBe(
//         'hillshade-layer-0',
//       );
//   });

//   layersOrderManager.getIdToMountOnTypesBottom('hillshade', '', (beforeId) => {
//     expect(
//       beforeId,
//       'test to get bottom type when multiple types are mounted',
//     ).toBe('hillshade-layer-0');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('hillshade', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the type before single layers type'
//     ).toBe('heatmap-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('heatmap', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the type before 2 layers type')
//       .toBe('fill-layer');
//   });

//   layersOrderManager.getIdToMountOnTypesTop('custom', '', (beforeId) => {
//     // prettier-ignore
//     expect(
//       beforeId,
//       'test for the last/top type of the type set'
//     ).toBeUndefined()
//   });
// });
