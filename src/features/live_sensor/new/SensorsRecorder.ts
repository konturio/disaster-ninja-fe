interface Recordable {
  id: string;
  ready: boolean;
  onUpdate;
}
export class SensorsRecorder<
  S extends {
    mainSensor: Recordable;
    forEach: (cb: (sensor: Recordable) => void) => void;
  },
> {
  private sensors: S;

  private onRecord: (collected: Map<string, Array<unknown>>) => void;

  /**
   * Collect data from sensors in storage on every main sensor change.
   */
  constructor(opt: {
    sensors: S;
    onRecord: (collected: Map<string, Array<unknown>>) => void;
  }) {
    this.sensors = opt.sensors;
    this.onRecord = opt.onRecord;
  }

  public record() {
    if (!this.sensors.mainSensor.ready) {
      throw Error('Main sensor not ready, recoding stopped');
    }

    this.collectingData();
    this.sensors.mainSensor.onUpdate(() => {
      this.onRecord(this.readCollected());
      this.flushCollected();
    });
  }

  public stop() {
    this.flushCollected();
  }

  private sensorsData = new Map<string, Array<unknown>>();
  private collectingData() {
    this.sensors.forEach((sensor) => {
      sensor.onUpdate((update) => {
        if (!this.sensorsData.has(sensor.id)) {
          this.sensorsData.set(sensor.id, []);
        }
        this.sensorsData.get(sensor.id)!.push(update);
      });
    });
  }

  private readCollected() {
    return new Map(this.sensorsData);
  }

  private flushCollected() {
    for (const sensor of this.sensorsData.keys()) {
      this.sensorsData.set(sensor, []);
    }
  }
}
