import { test, expect, vi, beforeEach } from 'vitest';
import { wait } from '~utils/test';
import { AppSensorsController } from '../AppSensorsController';
import { SensorsRecorder } from '../SensorsRecorder';
import { makeFakeSensor } from './FakeSensor';
import type { Constructor } from '../types';
import type { AppSensor } from '../sensors/AppSensor';

declare module 'vitest' {
  export interface TestContext {
    sensors: AppSensorsController<Constructor<AppSensor>[]>;
  }
}

beforeEach(async (ctx) => {
  ctx.sensors = new AppSensorsController([
    makeFakeSensor(100, 'main'), // <- Updates of first sensor used for record ticks in recorder
    makeFakeSensor(30, 'frequent'),
  ]);
  await ctx.sensors.init();
  return () => {
    ctx.sensors.stop();
  };
});

test('Recorder collect updates with main sensor frequency', async ({ sensors }) => {
  const recorder = new SensorsRecorder({
    sensors,
  });

  recorder.record();

  await wait(0.3);

  expect(recorder.records.length, 'No more often than the first sensor').toBe(2);
  expect(recorder.records.at(0)!.get('frequent')!.length, 'All updates recorded').toBe(3);

  recorder.stop();
});

test('Records removed after update tick', async ({ sensors }) => {
  const recorder = new SensorsRecorder({
    sensors,
  });

  recorder.record();

  await wait(0.3);

  //@ts-ignore
  const recordTimeInFirstSnapshot = recorder.records.at(0)!.get('main')!.at(0).updateTime;
  //@ts-ignore
  const recordTimeInSecondSnapshot = recorder.records
    .at(1)!
    .get('main')!
    .at(0).updateTime;

  expect(
    recordTimeInFirstSnapshot,
    "First update should'nt be included in second snapshot",
  ).not.toBe(recordTimeInSecondSnapshot);

  recorder.stop();
});
