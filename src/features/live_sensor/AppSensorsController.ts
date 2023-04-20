import type { AppSensor } from './sensors/AppSensor';
import type { Constructor } from './types';

export class AppSensorsController<S extends Array<Constructor<AppSensor>>> {
  mainSensor: AppSensor;
  sensors: Array<AppSensor>;
  settings: { mainSensorRefreshRate: number };
  /**
   * Main sensor - first sensors in sensors array
   * @param sensors - sensors
   **/
  constructor(sensors: S, settings: { mainSensorRefreshRate: number }) {
    this.settings = settings;
    this.sensors = sensors.map((Sensor, i) =>
      i === 0
        ? new Sensor({ timeout: this.settings.mainSensorRefreshRate })
        : new Sensor(),
    );
    const mainSensor = this.sensors.at(0);
    if (!mainSensor) {
      throw Error('At least one sensor needed');
    }
    this.mainSensor = mainSensor;
  }

  async init() {
    const setups = this.sensors.map((sensor) => sensor.setup());
    const setupResults = await Promise.allSettled(setups);

    setupResults.forEach((res) => {
      if (res.status === 'rejected') {
        console.error('Sensor activation failed:', res.reason);
      }
    });
  }

  forEach(cb: (sensor: AppSensor) => void) {
    this.sensors.forEach(cb);
  }

  stop() {
    this.sensors.forEach((sensor) => {
      sensor.stop();
    });
  }
}
