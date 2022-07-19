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

  constructor() {
    globalThis.kontur_markers = this.markers;
  }

  addSequence(name: string) {
    const sequence = new Sequence(name);
    this.sequences.add(sequence);
    return sequence;
  }

  mark(name: string, payload?: unknown) {
    this.markers.push(new MetricMarker(name));
    this.sequences.forEach((s) => {
      s.update(name, payload);
      if (s.sequenceEnded) {
        this.markers.push(new MetricMarker(this.loaded(s.name)));
        this.sequences.delete(s);
      }
    });
  }

  loaded(name: string) {
    return name + '.loaded';
  }

  loading(name: string) {
    return name + '.loading';
  }
}
