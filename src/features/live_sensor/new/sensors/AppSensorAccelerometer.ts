import { SensorEventsEmitter } from './SensorEventsEmitter';

export class AppSensorAccelerometer
  extends SensorEventsEmitter<{ x?: number; y?: number; z?: number }>
  implements AppSensor
{
  ready = false;
  readonly id = 'AppSensorAccelerometer';
  private options?: MotionSensorOptions;
  private sensor?: Accelerometer;

  constructor(options?: MotionSensorOptions) {
    super();
    this.options = options;
  }

  public async setup() {
    this.sensor = new Accelerometer(this.options);
    this.start();
    this.sensor.start();
    this.ready = true;
    return this;
  }

  private readingHandler = () => {
    if (this.sensor) {
      const { x, y, z } = this.sensor!;
      this.update({ x, y, z });
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
