import { Sequence } from './sequence';

class MetricMarker {
  readonly event: string;
  readonly timestamp: number;
  constructor(event: string) {
    this.event = event;
    this.timestamp = performance.now();
  }
}

class SessionSettings<F extends string> {
  toggle(setting: F) {
    window.sessionStorage.getItem(setting)
      ? window.sessionStorage.removeItem(setting)
      : window.sessionStorage.setItem(setting, 'true');
  }

  isEnabled(setting: F) {
    return window.sessionStorage.getItem(setting) !== null;
  }
}

export class AppMetrics {
  markers: MetricMarker[] = [];
  maxLogSize = 100;
  private sequences: Set<Sequence> = new Set();
  private completed: Record<string, number> = {};
  private eventLog: string[] = [];
  private settings = new SessionSettings<'KONTUR_SQ_ALERT' | 'KONTUR_SQ_LOG'>();

  constructor() {
    globalThis.KONTUR_METRICS = {
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

  processEvent(name: string, payload?: unknown) {
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
}
