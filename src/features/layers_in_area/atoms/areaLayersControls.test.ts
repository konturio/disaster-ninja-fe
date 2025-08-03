import { describe, expect, test } from 'vitest';
import { renameEventShapeLayer } from './renameEventShapeLayer';
import type { LayerSummaryDto } from '~core/logical_layers/types/source';

describe('renameEventShapeLayer', () => {
  test('replaces Event shape layer name with eventName', () => {
    const layers: LayerSummaryDto[] = [
      {
        id: 'eventShape',
        name: 'Event shape',
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      },
      {
        id: 'otherLayer',
        name: 'Other',
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      },
    ];

    const renamed = renameEventShapeLayer(layers, 'Flood');
    const eventLayer = renamed.find((l) => l.id === 'eventShape');
    expect(eventLayer?.name, 'Event layer name should match provided eventName').toBe(
      'Flood',
    );
  });

  test('returns original layers when eventName absent', () => {
    const layers: LayerSummaryDto[] = [
      {
        id: 'eventShape',
        name: 'Event shape',
        boundaryRequiredForRetrieval: false,
        ownedByUser: false,
      },
    ];

    const renamed = renameEventShapeLayer(layers, undefined);
    expect(renamed, 'Layers should remain unchanged').toEqual(layers);
  });
});
