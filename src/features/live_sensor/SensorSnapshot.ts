type UncertainNumber = number | null;

export interface SnapshotSensorsPayload {
  userAgent: string;

  lng: UncertainNumber;
  lat: UncertainNumber;
  alt: UncertainNumber;
  altAccuracy: UncertainNumber;
  speed: UncertainNumber;
  accuracy: UncertainNumber;
  heading: UncertainNumber;
  coordTimestamp: number;
  coordSystTimestamp: number;

  accelX?: UncertainNumber[];
  accelY?: UncertainNumber[];
  accelZ?: UncertainNumber[];
  accelTime?: UncertainNumber[];

  orientX?: UncertainNumber[];
  orientY?: UncertainNumber[];
  orientZ?: UncertainNumber[];
  orientW?: UncertainNumber[];
  orientTime?: UncertainNumber[];

  gyroX?: UncertainNumber[];
  gyroY?: UncertainNumber[];
  gyroZ?: UncertainNumber[];
  gyroTime?: UncertainNumber[];
}

export type SensorSnapshot = GeoJSON.FeatureCollection<
  GeoJSON.Point,
  SnapshotSensorsPayload
>;
