import { apiClient } from '~core/apiClientInstance';

const delay = (sec: number) => new Promise((res) => setTimeout(res, sec * 1000));

export class SensorsSnapshotsSender {
  private snapshotsOrder: Array<SensorSnapshot>;
  private maxAttempts: number;
  private timeoutSec: number;
  private attempt = 0;

  constructor(opt: {
    snapshotsQueue: Array<SensorSnapshot>;
    maxAttempts: number;
    timeoutSec: number;
  }) {
    this.snapshotsOrder = opt.snapshotsQueue;
    this.maxAttempts = opt.maxAttempts;
    this.timeoutSec = opt.timeoutSec;
  }

  public start() {
    this.sendFromQueue();
  }

  private running = true;
  async sendFromQueue() {
    // * Note: will not work in concurrent mode
    while (this.running && this.snapshotsOrder[0]) {
      const next = this.snapshotsOrder[0];
      this.attempt = 1;
      await this.send(next);
      this.snapshotsOrder.shift();
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
      await apiClient.post('/features/live-sensor', snapshot, true);
    } catch (e) {
      if (this.attempt < this.maxAttempts) {
        console.warn(
          `Failed attempt to send snapshot. Attempts left: ${
            this.maxAttempts - this.attempt
          }. Repeat after ${this.timeoutSec} sec`,
        );
        this.attempt += 1;
        await delay(this.timeoutSec);
        await this.send(snapshot);
      } else {
        throw Error('Failed attempts to send snapshot.');
      }
    }
  }
}
