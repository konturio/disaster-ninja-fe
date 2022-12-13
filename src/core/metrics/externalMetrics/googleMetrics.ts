import TagManager from 'react-gtm-module';
import type { Metric } from '../types';

export class GoogleMetrics implements Metric {
  private ready = false;

  init(appId: string, route: string) {
    TagManager.initialize({ gtmId: 'GTM-5LD2Z3D' });
    this.ready = true;
  }

  mark(name: string, payload: unknown) {
    /* Noop */
  }
}
