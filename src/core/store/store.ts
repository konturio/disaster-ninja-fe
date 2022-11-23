import { createStore } from '@reatom/core';
import { createDevtoolsLogger } from '~utils/debug/reatom-redux-devtools';
import type { AppMetricsI } from '..';

export class Store {
  /** Enable with localStorage.setItem('KONTUR_DEBUG', 'true') */
  private debug = !!globalThis.window?.localStorage.getItem('KONTUR_DEBUG');
  /**
   * Enable with localStorage.setItem('KONTUR_WARN', 'true')
   * will add stacktrace
   */
  private warn = !!globalThis.window?.localStorage.getItem('KONTUR_WARN');
  /** Enable with localStorage.setItem('KONTUR_TRACE_ERROR', '_error') */
  private traceType = globalThis.window?.localStorage.getItem('KONTUR_TRACE_TYPE');
  private metrics: AppMetricsI;
  private store!: ReturnType<typeof createStore>;

  constructor({ metrics }: { metrics: AppMetricsI }) {
    this.metrics = metrics;
    this.createStore();
  }

  private createStore() {
    const devtoolsLogger = createDevtoolsLogger();
    // Must be cutted out in production by terser
    if (import.meta.env.VITE_REDUX_DEV_TOOLS === 'true') {
      return createStore({
        onError: (error, t) => {
          if (this.debug) {
            console.error('STORE error:', error, t);
          }
          devtoolsLogger(t);
        },
        onPatch: (t) => devtoolsLogger(t),
        now: globalThis.performance?.now.bind(performance) ?? Date.now,
      });
    }
    this.store = createStore({
      onPatch: (t) => {
        if (import.meta.env.MODE !== 'test') {
          for (const action of t.actions) {
            if (!action.type.includes('invalidate')) {
              this.metrics.processEvent(action.type, action.payload);
              if (this.traceType) {
                if (action.type.includes(this.traceType)) {
                  console.trace('TRACE:', action.type, t);
                }
              }
              if (this.debug) {
                console.debug(action.type, action.payload);
              }
              if (this.warn) {
                console.warn(action.type, action.payload);
              }
            }
          }
        }
      },
    });
  }

  eject() {
    return this.store;
  }

  
}
