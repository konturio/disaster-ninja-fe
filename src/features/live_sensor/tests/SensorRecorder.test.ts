import { test, expect, vi, beforeEach } from 'vitest';
import { wait } from '~utils/test';
import { AppSensorsController } from '../AppSensorsController';
import { SensorsRecorder } from '../SensorsRecorder';
import { FakeSensor } from './FakeSensor';

declare module 'vitest' {
  export interface TestContext {
    sensors: AppSensorsController<FakeSensor[]>;
  }
}

beforeEach(async (ctx) => {
  ctx.sensors = new AppSensorsController([
    new FakeSensor(100, 'main'), // <- Updates of first sensor used for record ticks in recorder
    new FakeSensor(30, 'frequent'),
  ]);
  await ctx.sensors.init();
  return () => {
    ctx.sensors.stop();
  };
});

test('Recorder collect updates with main sensor frequency', async ({ sensors }) => {
  const records = new Array<Map<string, unknown[]>>();
  const recorder = new SensorsRecorder({
    sensors,
    onRecord(collected) {
      records.push(collected);
    },
  });

  recorder.record();

  await wait(0.3);

  expect(records.length, 'No more often than the first sensor').toBe(2);
  expect(records.at(0)!.get('frequent')!.length, 'All updates recorded').toBe(3);

  recorder.stop();
});

test('Records removed after update tick', async ({ sensors }) => {
  const records = new Array<Map<string, unknown[]>>();
  const recorder = new SensorsRecorder({
    sensors,
    onRecord(collected) {
      records.push(collected);
    },
  });

  recorder.record();

  await wait(0.3);

  //@ts-ignore
  const recordTimeInFirstSnapshot = records.at(0)!.get('main')!.at(0).updateTime;
  //@ts-ignore
  const recordTimeInSecondSnapshot = records.at(1)!.get('main')!.at(0).updateTime;

  expect(
    recordTimeInFirstSnapshot,
    "First update should'nt be included in second snapshot",
  ).not.toBe(recordTimeInSecondSnapshot);

  recorder.stop();
});

// test('snapshots', async ({ sensors }) => {
//   const records = new Array<Map<string, unknown[]>>();
//   const recorder = new SensorsRecorder({
//     sensors,
//     onRecord(collected) {
//       records.push(collected);
//     },
//   });

//   recorder.record();

//   await wait(0.3);

// });
