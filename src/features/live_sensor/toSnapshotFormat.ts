import { nanoid } from 'nanoid';
import { isNumber } from '~utils/common';
import { SENSOR_PRECISION } from './constants';
import type { AbsoluteOrientationSensorData } from './sensors/AppSensorAbsoluteOrientation';
import type { AccelerometerData } from './sensors/AppSensorAccelerometer';

const geoJSONPointInFeatureCollection = ({
  coordinates,
  properties,
  id,
}: {
  id: string;
  coordinates: SensorSnapshot['features'][number]['geometry']['coordinates'];
  properties: SensorSnapshot['features'][number]['properties'];
}) => ({
  type: 'FeatureCollection' as const,
  features: [
    {
      type: 'Feature' as const,
      id,
      geometry: {
        type: 'Point' as const,
        coordinates,
      },
      properties,
    },
  ],
});

type Squash<T> = {
  [P in keyof T]: Array<T[P]>;
};
function squash<T>(recs: Array<T>): Squash<T> {
  const result = {} as Squash<T>;
  recs.forEach((rec) => {
    for (const k in rec) {
      if (!result[k]) result[k] = [];
      result[k].push(rec[k]);
    }
  });
  return result;
}

const precise = (val: number | null) =>
  isNumber(val) ? Number(val.toPrecision(SENSOR_PRECISION)) : null;

export function toSnapshotFormat(collected: Map<string, unknown[]>): SensorSnapshot {
  // @ts-expect-error - since we use geolocation as leading sensor it must always present in snapshot
  const pos = collected.get('AppSensorGeolocation').at(0) as GeolocationPosition;

  const featureProperties: SensorSnapshot['features'][number]['properties'] = {
    /* Geolocation */
    lng: precise(pos.coords.longitude),
    lat: precise(pos.coords.latitude),
    alt: precise(pos.coords.altitude),
    altAccuracy: pos.coords.altitudeAccuracy,
    accuracy: precise(pos.coords.accuracy),
    speed: precise(pos.coords.speed),
    heading: precise(pos.coords.heading),
    coordTimestamp: pos.timestamp,
    /* System */
    userAgent: navigator.userAgent,
    coordSystTimestamp: Date.now(),
  };

  /* OrientationSensor */
  const orient = collected.get('AppSensorAbsoluteOrientation') as
    | Array<AbsoluteOrientationSensorData>
    | undefined;
  if (orient) {
    const squashedOrient = squash(orient);
    Object.assign(featureProperties, {
      orientX: squashedOrient.x.map(precise),
      orientY: squashedOrient.y.map(precise),
      orientZ: squashedOrient.z.map(precise),
      orientW: squashedOrient.w.map(precise),
      orientTime: squashedOrient.timestamp,
    });
  }

  /* Accelerometer */
  const accel = collected.get('AppSensorAccelerometer') as
    | Array<AccelerometerData>
    | undefined;
  if (accel) {
    const squashedAccel = squash(accel);
    Object.assign(featureProperties, {
      accelX: squashedAccel.x.map(precise),
      accelY: squashedAccel.y.map(precise),
      accelZ: squashedAccel.z.map(precise),
      accelTime: squashedAccel.timestamp,
    });
  }

  /* Gyroscope */
  const gyro = collected.get('AppSensorGyroscope') as
    | Array<AccelerometerData>
    | undefined;
  if (gyro) {
    const squashedGyro = squash(gyro);
    Object.assign(featureProperties, {
      gyroX: squashedGyro.x.map(precise),
      gyroY: squashedGyro.y.map(precise),
      gyroZ: squashedGyro.z.map(precise),
      gyroTime: squashedGyro.timestamp,
    });
  }

  return geoJSONPointInFeatureCollection({
    id: nanoid(21), // Equal to UUIDv4
    coordinates: [pos.coords.longitude, pos.coords.latitude],
    properties: featureProperties,
  });
}
