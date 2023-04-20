import { test, expect, vi } from 'vitest';
import { wait } from '~utils/test';
import { AppSensorsController } from '../AppSensorsController';
import { fakeSensorFabric } from './FakeSensor';

test('Sensors receive updates ', async () => {
  const sensors = new AppSensorsController([fakeSensorFabric(300, 'sensor')]);

  const cb = vi.fn(() => 0);
  sensors.forEach((sensor) => {
    sensor.onUpdate(cb);
  });

  await sensors.init();
  await wait(1);
  expect(cb).toHaveBeenCalledTimes(3);
  sensors.stop();
});
