import every from 'lodash/every';
import appConfig from '~core/app_config';
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
import type { AppFeatureType } from '~core/auth/types';
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
  watchList: Record<string, null | number> = {};
  reports: MetricsReportTemplate[] = [];

  static getInstance() {
    if (this._instance) {
      return this._instance;
    }
    this._instance = new AppMetrics();
    return this._instance;
  }

  private constructor() {
    //
  }

  init(appId: string, route: string, hasFeature: (f: AppFeatureType) => boolean): void {
    // currently we support metrics only for map page
    if (route !== '') {
      // '' is route for map
      return;
    }

    this.reportTemplate.appId = appId ?? '';

    // add available features to metrics
    this.watchList = buildWatchList(hasFeature);

    globalThis.addEventListener(METRICS_EVENT, this.listener.bind(this) as EventListener);

    if (KONTUR_METRICS_DEBUG) {
      console.info(`appMetrics.init route:${route}`, this.reportTemplate, this.watchList);
    }

    this.exposeMetrics();
  }

  // remove listeners and unsubscribe from atoms
  cleanup() {
    globalThis.removeEventListener(METRICS_EVENT, this.listener as EventListener);
    this.watch = () => null;
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

      const { [EVENT_MAP_IDLE]: mapIdleWatch, ...tempList } = this.watchList;
      if (every(tempList, Boolean)) {
        // watchList completed

        // we need to wait (again) EVENT_MAP_IDLE after all events from watchList
        // to determite that app is ready
        if (name !== EVENT_MAP_IDLE) {
          if (KONTUR_METRICS_DEBUG) {
            console.warn('metrics waiting final mapidle', this.watchList);
          }

          this.watchList[EVENT_MAP_IDLE] = null;
          // FIXME: replace globalThis?.KONTUR_MAP after init refactor
          globalThis?.KONTUR_MAP.triggerRepaint();
        } else {
          if (!mapIdleWatch) {
            // report mapidle if it was last watch
            this.report(EVENT_MAP_IDLE, timing);
          }

          // watchList done
          this.cleanup();
          this.report('ready', timing);
          readyForScreenshot();
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

    apiClient.post(APP_METRICS_ENDPOINT, [payload], true).catch((error) => {
      console.error('error posting metrics :', error, payload);
    });
  }
}

function readyForScreenshot() {
  // Still no reliable ways to detect when map is fully rendered, related issues are hanging for years
  // TODO: implement better map ready detection when possible
  globalThis?.KONTUR_MAP.once('idle', function () {
    setTimeout(() => {
      const eventReadyEvent = new Event('event_ready_for_screenshot');
      globalThis.dispatchEvent(eventReadyEvent);
      // debugger;
    }, 99); // extra time to prevent rendering glitches
  });
  globalThis?.KONTUR_MAP.triggerRepaint();
}
