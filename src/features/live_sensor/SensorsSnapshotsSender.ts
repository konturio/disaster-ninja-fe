import { apiClient } from '~core/apiClientInstance';
import { toSnapshotFormat } from './toSnapshotFormat';
import type { SensorSnapshot } from './SensorSnapshot';

const delay = (sec: number) => new Promise((res) => setTimeout(res, sec * 1000));

export class SensorsSnapshotsSender {
  private sensorsRecords: Array<Map<string, Array<unknown>>>;
  private maxAttempts: number;
  private timeoutSec: number;
  private attempt = 0;

  constructor(opt: {
    sensorsRecords: Array<Map<string, Array<unknown>>>;
    maxAttempts: number;
    timeoutSec: number;
  }) {
    this.sensorsRecords = opt.sensorsRecords;
    this.maxAttempts = opt.maxAttempts;
    this.timeoutSec = opt.timeoutSec;
  }

  public start() {
    this.sendFromQueue();
  }

  private running = true;
  async sendFromQueue() {
    // * Note: will not work in concurrent mode
    while (this.running && this.sensorsRecords.length > 0) {
      const next = this.sensorsRecords[0];
      this.attempt = 1;
      await this.send(toSnapshotFormat(next));
      this.sensorsRecords.shift();
    }

    if (this.running) {
      await delay(this.timeoutSec);
      this.sendFromQueue();
    }
  }

  public stop = () => {
    this.running = false;
  };

  private async send(snapshot: SensorSnapshot) {
    try {
      await apiClient.post('/features/live-sensor', snapshot, true, {
        retry: {
          attempts: this.maxAttempts - 1, // -1 because first try counts
          delayMs: this.timeoutSec * 1000,
        },
      });
    } catch (e) {
      throw Error('Failed attempts to send snapshot.');
    }
  }
}
