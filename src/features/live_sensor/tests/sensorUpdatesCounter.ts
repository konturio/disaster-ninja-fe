import type { AppSensor } from '../sensors/AppSensor';

export function sensorUpdatesCounter(sensor: AppSensor) {
  let i = 0;
  const cbs = new Set<() => void>();
  sensor.onUpdate(() => {
    i++;
    cbs.forEach((cb) => cb());
  });
  return (n: number): Promise<void> =>
    new Promise((res, rej) => {
      if (n < i) {
        rej(`Sensor counts more that expected.\nExpected: ${n}, counter: ${i}`);
      } else if (n === i) {
        res();
      } else {
        cbs.add(() => {
          if (n === i) {
            res();
          }
        });
      }
    });
}
