import { SensorEventsEmitter } from './SensorEventsEmitter';

export class AppSensorAbsoluteOrientation
  extends SensorEventsEmitter<[number, number, number, number]>
  implements AppSensor
{
  ready = false;
  readonly id = 'AppSensorAbsoluteOrientation';
  private options?: MotionSensorOptions;
  private sensor?: AbsoluteOrientationSensor;

  constructor(options?: MotionSensorOptions) {
    super();
    this.options = options;
  }

  public async setup() {
    this.sensor = new AbsoluteOrientationSensor(this.options);
    this.start();
    this.sensor.start();
    this.ready = true;
    return this;
  }

  private readingHandler = () => {
    if (this.sensor) {
      const quaternion = this.sensor.quaternion;
      quaternion &&
        this.update([quaternion[0], quaternion[1], quaternion[2], quaternion[3]]);
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
