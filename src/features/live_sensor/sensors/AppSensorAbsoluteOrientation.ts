import { SensorEventsEmitter } from './SensorEventsEmitter';
import type { AppSensor } from './AppSensor';

export type AbsoluteOrientationSensorData = {
  x: number | null;
  y: number | null;
  z: number | null;
  w: number | null;
  timestamp: number;
};
export class AppSensorAbsoluteOrientation
  extends SensorEventsEmitter<AbsoluteOrientationSensorData>
  implements AppSensor
{
  ready = false;
  readonly id = 'AppSensorAbsoluteOrientation';
  private sensor?: AbsoluteOrientationSensor;

  constructor() {
    super();
  }

  public async setup() {
    this.sensor = new AbsoluteOrientationSensor();
    this.start();
    this.ready = true;
    return this;
  }

  private readingHandler = () => {
    if (this.sensor) {
      const quaternion = this.sensor.quaternion;
      const time = this.sensor.timestamp;
      if (time && quaternion) {
        this.update({
          x: quaternion[0] ?? null,
          y: quaternion[1] ?? null,
          z: quaternion[2] ?? null,
          w: quaternion[3] ?? null,
          timestamp: time,
        });
      } else {
        console.error('Orientation sensor updated skipped: Bad data');
      }
    }
  };

  private errorHandler = (err: unknown) => {
    console.error(err);
  };

  private start() {
    if (this.sensor) {
      this.sensor.addEventListener('reading', this.readingHandler);
      this.sensor.addEventListener('error', this.errorHandler);
      this.sensor.start();
    }
  }

  public stop() {
    if (this.sensor) {
      this.sensor.removeEventListener('reading', this.readingHandler);
      this.sensor.removeEventListener('error', this.errorHandler);
      this.sensor.stop();
    }
  }
}
