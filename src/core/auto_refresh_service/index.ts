interface Watcher {
  callback: () => void | Promise<() => void>;
}

class AutoRefreshService {
  #watchers: Record<string, Watcher> = {};
  #inProgress: Set<string> = new Set();
  #intervalSec = 60;
  #timer: NodeJS.Timeout | null = null;

  constructor(sec = 60) {
    this.#intervalSec = sec;
    this.run();
  }

  run() {
    this.#timer = setInterval(() => {
      Object.entries(this.#watchers).forEach(([id, watcher]) => {
        const result = watcher.callback();
        if (result && 'finally' in result) {
          // Don't repeat request if previous still in progress
          if (this.#inProgress.has(id)) return;
          this.#inProgress.add(id);
          result.finally(() => this.#inProgress.delete(id));
        }
      });
    }, this.#intervalSec * 1000);
  }

  stop() {
    if (this.#timer) clearInterval(this.#timer);
  }

  addWatcher(id: string, callback: () => void) {
    this.#watchers[id] = { callback };
  }

  removeWatcher(id: string) {
    delete this.#watchers[id];
  }
}

export const autoRefreshService = new AutoRefreshService(60 /* sec */);
