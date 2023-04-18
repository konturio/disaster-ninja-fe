import { SensorsRecorder } from './SensorsRecorder';
import { AppSensorAbsoluteOrientation } from './sensors/AppSensorAbsoluteOrientation';
import { AppSensorAccelerometer } from './sensors/AppSensorAccelerometer';
import { AppSensorGeolocation } from './sensors/AppSensorGeolocation';
import { AppSensorGyroscope } from './sensors/AppSensorGyroscope';
import { AppSensorsController } from './AppSensorsController';
import { SensorsSnapshotsSender } from './SensorsSnapshotsSender';
import { toSnapshotFormat } from './toSnapshotFormat';

export async function main() {
  const sensors = new AppSensorsController([
    new AppSensorGeolocation(), // <- Updates of first sensor used for record ticks in recorder
    new AppSensorAbsoluteOrientation(),
    new AppSensorAccelerometer(),
    new AppSensorGyroscope(),
  ]);

  const snapshotsQueue = new Array<SensorSnapshot>();

  const recorder = new SensorsRecorder({
    sensors,
    onRecord(collected) {
      const snapshot = toSnapshotFormat(collected);
      snapshotsQueue.push(snapshot);
    },
  });

  // const sender = new SensorsSnapshotsSender({
  //   snapshotsQueue,
  //   maxAttempts: 10,
  //   timeoutSec: 5,
  // });

  // console.log('🚀 ~ main ~ snapshotsQueue:', { snapshotsQueue })

  try {
    await sensors.init();
    recorder.record();
    // sender.start();
  } catch (e) {
    console.error(e);
    // sender.stop();
    recorder.stop();
    sensors.stop();
  }

  return () => {
    // sender.stop(); // Should we stop sending collected data after feature disabled?
    recorder.stop();
    sensors.stop();
  };
}
