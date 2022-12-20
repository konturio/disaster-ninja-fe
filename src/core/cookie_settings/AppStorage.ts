export class AppStorage<T> {
  state: Record<string, T> = {};
  namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
    this.restoreState();
  }

  restoreState() {
    if (globalThis.localStorage) {
      const serializedState = globalThis.localStorage.getItem(this.namespace);
      try {
        /* When cookies rules will grow this must be moved to microtasks/worker */
        this.state = serializedState ? JSON.parse(serializedState) : {};
      } catch (error) {
        console.debug('Failed to load cookies settings', error);
      }
    }
  }

  persistState() {
    if (globalThis.localStorage) {
      /* When cookies rules will grow this must be moved to microtasks/worker */
      const serializedState = JSON.stringify(this.state);
      globalThis.localStorage.setItem(this.namespace, serializedState);
    }
  }

  get(key: string): T | null {
    return this.state[key] ?? null;
  }

  set(key: string, value: any) {
    this.state[key] = value;
    this.persistState();
  }

  remove(key: string) {
    delete this.state[key];
    this.persistState();
  }
}
