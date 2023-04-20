import { SensorEventsEmitter } from './SensorEventsEmitter';
import type { AppSensor } from './AppSensor';

export class AppSensorGeolocation
  extends SensorEventsEmitter<GeolocationPosition>
  implements AppSensor
{
  ready = false;
  readonly id = 'AppSensorGeolocation';
  private locatorId: number | null = null;
  private options?: PositionOptions;

  constructor(options?: PositionOptions) {
    super();
    this.options = options;
  }

  public async setup() {
    if (!navigator.geolocation) {
      throw Error('Geolocation not supported');
    }

    this.locatorId = navigator.geolocation.watchPosition(
      (pos) => this.update(pos),
      (err) => console.error(`ERROR(${err.code}): ${err.message}`),
      this.options,
    );

    this.ready = true;
    return this;
  }

  public stop() {
    this.locatorId && navigator.geolocation.clearWatch(this.locatorId);
  }
}
