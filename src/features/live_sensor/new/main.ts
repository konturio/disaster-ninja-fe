import { SensorsRecorder } from './SensorsRecorder';
import { AppSensorAbsoluteOrientation } from './sensors/AppSensorAbsoluteOrientation';
import { AppSensorAccelerometer } from './sensors/AppSensorAccelerometer';
import { AppSensorGeolocation } from './sensors/AppSensorGeolocation';
import { AppSensorGyroscope } from './sensors/AppSensorGyroscope';
import { AppSensorsController } from './AppSensorsController';
import { SensorsSnapshotsSender } from './SensorsSnapshotsSender';
import { toSnapshotFormat } from './toSnapshotFormat';

export class LiveSensor {
  sensors?: AppSensorsController<
    (
      | AppSensorGeolocation
      | AppSensorAbsoluteOrientation
      | AppSensorAccelerometer
      | AppSensorGyroscope
    )[]
  >;
  recorder?: SensorsRecorder<any>;
  sender?: SensorsSnapshotsSender;

  async start() {
    this.sensors = new AppSensorsController([
      new AppSensorGeolocation(), // <- Updates of first sensor used for record ticks in recorder
      new AppSensorAbsoluteOrientation(),
      new AppSensorAccelerometer(),
      new AppSensorGyroscope(),
    ]);

    const snapshotsQueue = new Array<SensorSnapshot>();

    this.recorder = new SensorsRecorder({
      sensors: this.sensors,
      onRecord(collected) {
        const snapshot = toSnapshotFormat(collected);
        snapshotsQueue.push(snapshot);
      },
    });

    this.sender = new SensorsSnapshotsSender({
      snapshotsQueue,
      maxAttempts: 10,
      timeoutSec: 5,
    });

    try {
      await this.sensors.init();
      this.recorder.record();
      this.sender.start();
    } catch (e) {
      console.error(e);
      this.stop();
    }
  }

  stop() {
    this.sender?.stop(); // TODO: Stop after snapshotsQueue became empty
    this.recorder?.stop();
    this.sensors?.stop();
  }
}
