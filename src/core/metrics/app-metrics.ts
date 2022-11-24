import every from 'lodash/every';
import appConfig from '~core/app_config';
import { METRICS_EVENT } from './dispatch';
import { Sequence } from './sequence';
import type { MetricsReportTemplate, MetricsEvent } from './types';

const APP_METRICS_ENDPOINT = appConfig.apiGateway + '/rum/metrics';
const EVENT_MAP_IDLE = 'setTrue_mapIdle';
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

export class AppMetrics {
  markers: MetricMarker[] = [];
  maxLogSize = 100;
  private sequences: Set<Sequence> = new Set();
  private completed: Record<string, number> = {};
  private eventLog: string[] = [];
  private settings = new SessionSettings<'KONTUR_SQ_ALERT' | 'KONTUR_SQ_LOG'>();
  reportTemplate: MetricsReportTemplate = {
    name: '',
    value: 0,
    type: 'SUMMARY',
    appId: '',
    userId: '',
    buildVersion: `${import.meta.env.PACKAGE_VERSION}-${import.meta.env.MODE}`,
  };
  listener: void;

  constructor() {
    globalThis.KONTUR_METRICS = {
      watchList: this.watchList,
      markers: this.markers,
      sequences: this.sequences,
      events: this.eventLog,
      toggleAlert: () => this.settings.toggle('KONTUR_SQ_ALERT'),
      toggleLog: () => this.settings.toggle('KONTUR_SQ_LOG'),
    };
    this.listener = globalThis.addEventListener(METRICS_EVENT, ((e: MetricsEvent) => {
      this.processEvent(e.detail.name, e.detail.payload);
    }) as EventListener);
  }

  init(appId: string, userId: string | null) {
    this.reportTemplate.appId = appId ?? '';
    this.reportTemplate.userId = userId === 'public' ? null : userId ?? null;
    if (this.settings.isEnabled('KONTUR_SQ_LOG')) {
      console.info('appMetrics.init', this.reportTemplate);
    }
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

  watchList = {
    // _done_userResourceAtom: null, // should be done before init
    _done_currentEventResource: null,
    _done_layersGlobalResource: null,
    _done_analyticsResource: null,
    // _done_areaLayersDetailsResourceAtom: null, // can be disabled in url
    _done_layersInAreaAndEventLayerResource: null,
    // _done_eventListResource: null,
    [EVENT_MAP_IDLE]: null,
  };

  watch(name: string) {
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
    if (this.settings.isEnabled('KONTUR_SQ_LOG')) {
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
