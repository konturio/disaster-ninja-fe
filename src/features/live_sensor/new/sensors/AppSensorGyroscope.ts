import { SensorEventsEmitter } from './SensorEventsEmitter';

export type GyroscopeData = {
  x: number | null;
  y: number | null;
  z: number | null;
  timestamp: number;
};

export class AppSensorGyroscope
  extends SensorEventsEmitter<GyroscopeData>
  implements AppSensor
{
  ready = false;
  readonly id = 'AppSensorGyroscope';
  private options?: MotionSensorOptions;
  private sensor?: Gyroscope;

  constructor(options?: MotionSensorOptions) {
    super();
    this.options = options;
  }

  public async setup() {
    this.sensor = new Gyroscope(this.options);
    this.start();
    this.sensor.start();
    this.ready = true;
    return this;
  }

  private readingHandler = () => {
    if (this.sensor) {
      const timestamp = this.sensor.timestamp;
      const { x, y, z } = this.sensor;
      if (timestamp) {
        this.update({ x: x ?? null, y: y ?? null, z: z ?? null, timestamp });
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
