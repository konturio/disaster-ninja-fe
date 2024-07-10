import { apiClient } from '~core/apiClientInstance';
import { KONTUR_METRICS_DEBUG } from '~utils/debug';
import { AppFeature } from '~core/auth/types';
import {
  METRICS_EVENT,
  METRICS_REPORT_TEMPLATE,
  EVENT_MAP_IDLE,
  buildWatchList,
} from './constants';
import { Sequence } from './sequence';
import type { MetricsReportTemplate, MetricsEvent, Metric } from './types';
import type { AppFeatureType } from '~core/auth/types';

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
export class AppMetrics implements Metric {
  static _instance: AppMetrics;
  markers: MetricMarker[] = [];
  maxLogSize = 100;
  private sequences: Set<Sequence> = new Set();
  private completed: Record<string, number> = {};
  private eventLog: string[] = [];
  private settings = new SessionSettings<'KONTUR_SQ_ALERT' | 'KONTUR_SQ_LOG'>();
  reportTemplate: MetricsReportTemplate = METRICS_REPORT_TEMPLATE;
  watchList: Record<string, null | number> = {};
  reports: MetricsReportTemplate[] = [];

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new AppMetrics();
    return this._instance;
  }

  init(appId: string, routeId: string, hasFeature: (f: AppFeatureType) => boolean): void {
    // currently we support metrics only for map page
    if (routeId !== 'map') {
      // '' is route for map
      return;
    }

    this.reportTemplate.appId = appId ?? '';

    // add available features to metrics
    this.watchList = buildWatchList(hasFeature);

    globalThis.addEventListener(METRICS_EVENT, this.listener.bind(this) as EventListener);

    globalThis.addEventListener(
      'visibilitychange',
      this.visibilityListener.bind(this) as EventListener,
    );

    if (KONTUR_METRICS_DEBUG) {
      console.info(
        `appMetrics.init route:${routeId}`,
        this.reportTemplate,
        this.watchList,
      );
    }

    this.exposeMetrics();
  }

  // remove listeners and unsubscribe from atoms
  cleanup() {
    globalThis.removeEventListener(METRICS_EVENT, this.listener as EventListener);
    globalThis.removeEventListener(
      'visibilitychange',
      this.visibilityListener.bind(this) as EventListener,
    );
    this.watch = () => null;
  }

  visibilityListener() {
    if (globalThis.document.visibilityState === 'hidden') {
      // stop metrics processing when page is hidden because of irrelevant timing
      this.cleanup();
    }
  }

  exposeMetrics() {
    globalThis.KONTUR_METRICS = {
      watchList: this.watchList,
      reports: this.reports,
      markers: this.markers,
      sequences: this.sequences,
      events: this.eventLog,
      toggleAlert: () => this.settings.toggle('KONTUR_SQ_ALERT'),
      toggleLog: () => this.settings.toggle('KONTUR_SQ_LOG'),
    };
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
    this.watch(name, payload);
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

  watch(name: string, payload?: unknown) {
    // if current_event not available do not wait analytics etc
    // TODO: use runtimeDepsTree after further analysis
    if (name === AppFeature.CURRENT_EVENT && payload === false) {
      delete this.watchList[AppFeature.ANALYTICS_PANEL];
      delete this.watchList['_done_layersInAreaAndEventLayerResource'];
    }

    if (this.watchList[name] === null) {
      const timing = performance.now();
      this.watchList[name] = timing;

      if (Object.values(this.watchList).every(Boolean)) {
        // watchList completed

        // we need to wait (again) EVENT_MAP_IDLE after all events from watchList
        // to determite that app is ready
        if (name !== EVENT_MAP_IDLE) {
          if (KONTUR_METRICS_DEBUG) {
            console.warn('metrics waiting final mapIdle', this.watchList);
          }

          this.watchList[EVENT_MAP_IDLE] = null;

          // repaint to ensure EVENT_MAP_IDLE will be triggered
          // FIXME: replace globalThis?.KONTUR_MAP after init refactor
          globalThis?.KONTUR_MAP.triggerRepaint();
        } else {
          // app is ready
          this.cleanup();
          this.report('ready', timing);
          this.sendReports();

          emitReadyForScreenshot(globalThis?.KONTUR_MAP);
          return;
        }
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

    this.reports.push(payload);
  }

  sendReports() {
    apiClient.post('/rum/metrics', this.reports, true).catch((error) => {
      console.error('error posting metrics :', error, this.reports);
    });
  }
}

function emitReadyForScreenshot(map) {
  // Still no reliable ways to detect when map is fully rendered, related issues are hanging for years
  // TODO: implement better map rendered detection when possible
  map.once('idle', function () {
    setTimeout(() => {
      const eventReadyEvent = new Event('event_ready_for_screenshot');
      globalThis.dispatchEvent(eventReadyEvent);
    }, 99); // extra time to prevent rendering glitches
  });
  // repaint to ensure EVENT_MAP_IDLE will be triggered after map render events
  map.triggerRepaint();
}
