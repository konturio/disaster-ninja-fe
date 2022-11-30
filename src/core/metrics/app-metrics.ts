import every from 'lodash/every';
import appConfig from '~core/app_config';
import { KONTUR_METRICS_DEBUG } from '~utils/debug';
import { currentModeAtom } from '~core/modes/currentMode';
import {
  METRICS_EVENT,
  METRICS_REPORT_TEMPLATE,
  METRICS_WATCH_LIST,
  EVENT_MAP_IDLE,
} from './constants';
import { Sequence } from './sequence';
import type { Unsubscribe } from '@reatom/core';
import type { MetricsReportTemplate, MetricsEvent } from './types';

const APP_METRICS_ENDPOINT = appConfig.apiGateway + '/rum/metrics';

class MetricMarker {
  readonly event: string;
  readonly timestamp: number;
  constructor(event: string) {
    this.event = event;
    this.timestamp = performance.now();
  }
}

class SessionSettings<F extends string> {
  storage = globalThis.window?.sessionStorage;

  toggle(setting: F) {
    if (!this.storage) return;
    this.storage.getItem(setting)
      ? this.storage.removeItem(setting)
      : this.storage.setItem(setting, 'true');
  }

  isEnabled(setting: F) {
    if (!this.storage) return false;
    return this.storage.getItem(setting) !== null;
  }
}

/**
 * Singleton, use AppMetrics.getInstance()
 */
export class AppMetrics {
  static _instance: AppMetrics;
  markers: MetricMarker[] = [];
  maxLogSize = 100;
  private sequences: Set<Sequence> = new Set();
  private completed: Record<string, number> = {};
  private eventLog: string[] = [];
  private settings = new SessionSettings<'KONTUR_SQ_ALERT' | 'KONTUR_SQ_LOG'>();
  reportTemplate: MetricsReportTemplate = METRICS_REPORT_TEMPLATE;
  private mode = '';
  private unsubscribeCurrentModeAtom: Unsubscribe;

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new AppMetrics();
    return this._instance;
  }

  private constructor() {
    globalThis.KONTUR_METRICS = {
      watchList: this.watchList,
      markers: this.markers,
      sequences: this.sequences,
      events: this.eventLog,
      toggleAlert: () => this.settings.toggle('KONTUR_SQ_ALERT'),
      toggleLog: () => this.settings.toggle('KONTUR_SQ_LOG'),
    };
    globalThis.addEventListener(METRICS_EVENT, this.listener as EventListener);
    this.unsubscribeCurrentModeAtom = currentModeAtom.subscribe(
      (mode) => (this.mode = mode),
    );
  }

  init(appId: string, userEmail: string | null) {
    this.reportTemplate.appId = appId ?? '';
    this.reportTemplate.userId = userEmail === 'public' ? null : userEmail ?? null;

    if (KONTUR_METRICS_DEBUG) {
      console.info('appMetrics.init', this.reportTemplate);
    }
  }

  // remove listeners and unsubscribe from atoms
  cleanup() {
    globalThis.removeEventListener(METRICS_EVENT, this.listener as EventListener);
    this.unsubscribeCurrentModeAtom();
  }

  recordEventToLog(name: string) {
    this.eventLog.push(name);
    if (this.settings.isEnabled('KONTUR_SQ_LOG')) {
      // eslint-disable-next-line no-console
      console.debug(name);
    }
    while (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }
  }

  addSequence(name: string) {
    const sequence = new Sequence(name);
    this.sequences.add(sequence);
    return sequence;
  }

  /**
   * Mark - create record with timing of metric event
   * and event about mark was created
   */
  mark(name: string, payload?: unknown) {
    this.markers.push(new MetricMarker(name));
    // Mark was created event
    this.processEvent(name, payload);
  }

  private processEvent(name: string, payload?: unknown) {
    this.watch(name);
    this.recordEventToLog(name);
    this.sequences.forEach((s) => {
      s.update(name, payload);
      if (s.sequenceEnded) {
        this.markers.push(new MetricMarker(s.name + '_ended'));
        this.sequences.delete(s);
        this.completed[s.name] = performance.now();
        if (this.settings.isEnabled('KONTUR_SQ_ALERT')) {
          alert(`Sequence ${name} ended`);
        }
      }
    });
  }

  listener(e: MetricsEvent) {
    this.processEvent(e.detail.name, e.detail.payload);
  }

  watchList = METRICS_WATCH_LIST;

  watch(name: string) {
    // TODO: implement watchlists for other modes if necessary
    // currently only map mode supported

    if (this.mode !== 'map') return;

    if (this.watchList[name] === null) {
      const timing = performance.now();
      this.watchList[name] = timing;
      if (every(this.watchList, Boolean)) {
        // we need to wait EVENT_MAP_IDLE after all events from watchList
        // to determite that app is ready
        if (name !== EVENT_MAP_IDLE) {
          this.watchList[EVENT_MAP_IDLE] = null;
          return;
        }

        setTimeout(() => {
          this.report('ready', timing);
          const eventReadyEvent = new Event('event_ready_for_screenshot');
          window.dispatchEvent(eventReadyEvent);
        }, 299);
        return;
      }
      this.report(name, timing);
    }
  }

  report(name: string, timing: number) {
    const payload = {
      ...this.reportTemplate,
      name,
      value: timing,
    };
    if (KONTUR_METRICS_DEBUG) {
      console.warn('metrics', payload);
    }
    // TODO: use apiClientInstance after app init refactor
    fetch(APP_METRICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([payload]),
    }).catch((error) => {
      console.error('sent metrics error:', error, payload);
    });
  }
}
