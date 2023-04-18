export class AppSensorsController<S extends Array<AppSensor>> {
  mainSensor: AppSensor;
  sensors: S;
  /**
   * Main sensor - first sensors in sensors array
   * @param sensors - sensors
   **/
  constructor(sensors: S) {
    if (sensors.length < 1) {
      throw Error('At least one sensor needed');
    }
    this.sensors = sensors;
    this.mainSensor = sensors[0];
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
