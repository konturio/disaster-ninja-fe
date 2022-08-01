import { Sequence } from './sequence';

class MetricMarker {
  readonly event: string;
  readonly timestamp: number;

  constructor(event: string) {
    this.event = event;
    this.timestamp = performance.now();
  }
}

export class AppMetrics {
  markers: MetricMarker[] = [];
  private sequences: Set<Sequence> = new Set();
  private eventLog: Set<string> = new Set();

  constructor() {
    globalThis.KONTUR_METRICS = {
      sequences: this.sequences,
      events: this.eventLog,
    };
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
    this.eventLog.add(name);
    this.sequences.forEach((s) => {
      s.update(name, payload);
      if (s.sequenceEnded) {
        this.markers.push(new MetricMarker(s.name + '_ended'));
        this.sequences.delete(s);
      }
    });
  }
}
