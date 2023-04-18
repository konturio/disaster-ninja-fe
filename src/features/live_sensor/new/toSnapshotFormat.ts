import { nanoid } from 'nanoid';
import { isNumber } from '~utils/common';

const geoJSONPointInFeatureCollection = ({
  coordinates,
  properties,
}: {
  coordinates: SensorSnapshot['features'][number]['geometry']['coordinates'];
  properties: SensorSnapshot['features'][number]['properties'];
}) => ({
  type: 'FeatureCollection' as const,
  id: nanoid(21), // Equal to UUIDv4
  features: [
    {
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates,
      },
      properties,
    },
  ],
});

function normalizeValues<T extends Record<string, string | number | undefined | null>>(
  values: T,
  precision = 6,
): Record<keyof T, number | null> {
  // @ts-expect-error - object filled later
  const newObject: Record<keyof T, number | null> = {};
  Object.entries(values).forEach(
    ([key, val]: [keyof T, string | number | undefined | null]) => {
      newObject[key] = isNumber(val) ? Number(val.toPrecision(precision)) : null;
    },
  );
  return newObject;
}

function squash<T extends Record<string, unknown>>(recs: Array<T>) {
  const result: Record<string, Array<T>> = {};

  recs.forEach((rec) => {
    Object.entries(rec).forEach(([k, v]) => {
      if (!result[k]) result[k] = [];
      result[k].push(v);
    });
  });

  return result;
}

export function toSnapshotFormat(collected: Map<string, unknown[]>): SensorSnapshot {
  const pos = squash(
    (collected.get('AppSensorGeolocation') as Array<GeolocationPosition> | undefined) ??
      [],
  );

  return geoJSONPointInFeatureCollection({
    coordinates: [],
    properties: Object.assign(
      normalizeValues({
        /* Geolocation */
        lng: pos?.coords?.longitude,
        lat: pos?.coords?.latitude,
        alt: pos?.coords?.altitude,
        altAccuracy: pos?.coords?.altitudeAccuracy,
        accuracy: pos?.coords?.accuracy,
        speed: pos?.coords?.speed,
        heading: pos?.coords?.heading,
        /* Accelerometer */
        accelX: null,
        accelY: null,
        accelZ: null,
        /* OrientationSensor */
        orientX: null,
        orientY: null,
        orientZ: null,
        orientW: null,
        /* Gyroscope */
        gyroX: null,
        gyroY: null,
        gyroZ: null,
      }),
      {
        coordTimestamp: 0,
        accelTime: 0,
        orientTime: 0,
        gyroTime: 0,
        /* System */
        userAgent: navigator.userAgent,
        coordSystTimestamp: new Date().getTime(),
      },
    ),
  });
}
