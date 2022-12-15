import type { Metric } from '../types';

export class GoogleMetrics implements Metric {
  private ready = false;

  init(appId: string, route: string) {
    import('react-gtm-module').then((TagManager) => {
      TagManager.initialize({ gtmId: 'GTM-5LD2Z3D' });
      this.ready = true;
    });
  }

  mark(name: string, payload: unknown) {
    /* Noop */
  }
}
