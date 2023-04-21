import { SensorEventsEmitter } from '../sensors/SensorEventsEmitter';
import type { AppSensor } from '../sensors/AppSensor';

export const makeFakeSensor = (frequency: number, id: string) => {
  return class FakeSensor
    extends SensorEventsEmitter<{ id: string; updateTime }>
    implements AppSensor
  {
    id: string;
    ready = false;
    frequency: number;
    interval: NodeJS.Timer | null = null;

    constructor() {
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
  };
};
