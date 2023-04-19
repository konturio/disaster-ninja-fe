import { SensorEventsEmitter } from '../sensors/SensorEventsEmitter';
import type { AppSensor } from '../sensors/AppSensor';
import type { Constructor } from '../types';

export const fakeSensorFabric = (
  frequency: number,
  id: string,
): Constructor<FakeSensor> => {
  // @ts-expect-error hackish solution
  return class {
    constructor() {
      Object.assign(this, new FakeSensor(frequency, id));
    }
  };
};

export class FakeSensor
  extends SensorEventsEmitter<{ id: string; updateTime }>
  implements AppSensor
{
  id: string;
  ready = false;
  frequency: number;
  interval: NodeJS.Timer | null = null;

  constructor(frequency: number, id: string) {
    super();
    this.id = id;
    this.frequency = frequency;
  }

  async setup() {
    this.interval = setInterval(() => {
      this.update({ id: this.id, updateTime: Date.now() });
    }, this.frequency);
    this.ready = true;
    return this;
  }

  stop() {
    this.interval && clearInterval(this.interval);
  }
}
