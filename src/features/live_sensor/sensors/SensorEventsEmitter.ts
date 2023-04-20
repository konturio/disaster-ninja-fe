export class SensorEventsEmitter<P = any> {
  listeners = new Set<(payload: P) => void>();

  public onUpdate(cb: (payload: P) => void) {
    this.listeners.add(cb);
  }

  update(payload: P) {
    this.listeners.forEach((listener) => {
      listener(payload);
    });
  }
}
