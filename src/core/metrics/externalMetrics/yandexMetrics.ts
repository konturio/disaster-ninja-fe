import type { Metric } from '../types';

export class YandexMetrics implements Metric {
  private ready = false;
  private yandexAccountId!: string;
  private ym!: (id: string, name: string, payload: any) => void;

  init(appId: string, route: string) {
    this.yandexAccountId = globalThis.yandexAccountId;
    this.ym = globalThis.ym;
    if (this.yandexAccountId !== undefined && typeof this.ym === 'function') {
      this.ready = true;
    }
  }

  mark(name: string, payload: unknown) {
    if (!this.ready) {
      console.warn('Mark skipped. Yandex metric not loaded.');
      return;
    }
    this.ym(this.yandexAccountId, name, payload);
  }

  reset() {
    if (!this.ready) return;
    this.ym(this.yandexAccountId, 'setUserID', '');
  }
}
