import { SensorsRecorder } from './SensorsRecorder';
import { AppSensorAbsoluteOrientation } from './sensors/AppSensorAbsoluteOrientation';
import { AppSensorAccelerometer } from './sensors/AppSensorAccelerometer';
import { AppSensorGeolocation } from './sensors/AppSensorGeolocation';
import { AppSensorGyroscope } from './sensors/AppSensorGyroscope';
import { SensorsSnapshotsSender } from './SensorsSnapshotsSender';
import { AppSensorsController } from './AppSensorsController';
import type { Constructor } from './types';

export class LiveSensor {
  sensors?: AppSensorsController<
    (
      | Constructor<AppSensorGeolocation>
      | Constructor<AppSensorAbsoluteOrientation>
      | Constructor<AppSensorAccelerometer>
      | Constructor<AppSensorGyroscope>
    )[]
  >;
  recorder?: SensorsRecorder<any>;
  sender?: SensorsSnapshotsSender;

  async start() {
    this.sensors = new AppSensorsController(
      [
        AppSensorGeolocation, // <- Updates of first sensor used for record ticks in recorder
        AppSensorAbsoluteOrientation,
        AppSensorAccelerometer,
        AppSensorGyroscope,
      ],
      {
        mainSensorRefreshRate: 1000,
      },
    );

    this.recorder = new SensorsRecorder({
      sensors: this.sensors,
    });

    this.sender = new SensorsSnapshotsSender({
      sensorsRecords: this.recorder.records,
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
