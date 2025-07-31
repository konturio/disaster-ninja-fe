import { describe, test, expect, beforeAll } from 'vitest';
import { toSnapshotFormat } from './toSnapshotFormat';

// Helper to create geolocation sample
function geo(lat: number, lng: number): GeolocationPosition {
  return {
    coords: {
      latitude: lat,
      longitude: lng,
      altitude: 10,
      altitudeAccuracy: 1,
      accuracy: 5,
      speed: 2,
      heading: 1,
    },
    timestamp: Date.now(),
  } as GeolocationPosition;
}

describe('toSnapshotFormat', () => {
  beforeAll(() => {
    // provide navigator for the tested module in a safe way
    // navigator is read-only on the global object so we define it via defineProperty
    Object.defineProperty(global, 'navigator', {
      value: { userAgent: 'test-agent' },
      configurable: true,
    });
  });
  test('creates feature collection with generated id', () => {
    const map = new Map<string, any[]>();
    map.set('AppSensorGeolocation', [geo(1, 2)]);
    const snapshot = toSnapshotFormat(map);
    expect(snapshot.type).toBe('FeatureCollection');
    expect(snapshot.features[0].id).toMatch(/^\w{22}$/);
  });
});
