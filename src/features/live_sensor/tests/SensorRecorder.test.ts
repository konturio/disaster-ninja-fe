import { test, expect, beforeEach } from 'vitest';
import { AppSensorsController } from '../AppSensorsController';
import { SensorsRecorder } from '../SensorsRecorder';
import { makeFakeSensor } from './FakeSensor';
import { sensorUpdatesCounter } from './sensorUpdatesCounter';
import type { Constructor } from '../types';
import type { AppSensor } from '../sensors/AppSensor';

declare module 'vitest' {
  export interface TestContext {
    sensors: AppSensorsController<Constructor<AppSensor>[]>;
    mainSensorUpdates: (n: number) => Promise<void>;
  }
}

beforeEach(async (ctx) => {
  ctx.sensors = new AppSensorsController([
    makeFakeSensor(100, 'main'), // <- Updates of first sensor used for record ticks in recorder
    makeFakeSensor(23, 'frequent'),
  ]);
  ctx.mainSensorUpdates = sensorUpdatesCounter(ctx.sensors.mainSensor);
  await ctx.sensors.init();
  return () => {
    ctx.sensors.stop();
  };
});

test.skip('Recorder collect updates with main sensor frequency', async ({
  sensors,
  mainSensorUpdates,
}) => {
  const recorder = new SensorsRecorder({
    sensors,
  });

  recorder.record();
  await mainSensorUpdates(1);
  recorder.stop();

  expect(
    recorder.records.length,
    'Recorder create records with main sensor frequency',
  ).toBe(1);

  expect(recorder.records.at(0)!.get('frequent')!.length, 'All updates recorded').toBe(4); // 100 / 23 = ~4.34
});

test('Records removed after update tick', async ({ sensors, mainSensorUpdates }) => {
  const recorder = new SensorsRecorder({
    sensors,
  });

  recorder.record();
  await mainSensorUpdates(2);
  recorder.stop();

  const recordsInFirstSnapshot = recorder.records.at(0)?.get('frequent');
  const recordsInSecondSnapshot = recorder.records.at(1)?.get('frequent');
  expect(recordsInFirstSnapshot?.length).toBeDefined();
  expect(recordsInSecondSnapshot?.length).toBeDefined();
  expect(recordsInFirstSnapshot!.length, 'Same records count in snapshots').toBe(
    recordsInSecondSnapshot!.length,
  );
});
