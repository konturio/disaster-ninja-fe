interface Watcher {
  callback: () => void | Promise<() => void>;
}

class AutoRefreshService {
  private watchers: Record<string, Watcher> = {};
  private inProgress: Set<string> = new Set();
  private intervalSec = 60;
  private timer: NodeJS.Timeout | null = null;

  constructor(sec = 60) {
    this.intervalSec = sec;
    this.run();
  }

  run() {
    this.timer = setInterval(() => {
      Object.entries(this.watchers).forEach(([id, watcher]) => {
        const result = watcher.callback();
        if (result && 'finally' in result) {
          // Don't repeat request if previous still in progress
          if (this.inProgress.has(id)) return;
          this.inProgress.add(id);
          result.finally(() => this.inProgress.delete(id));
        }
      });
    }, this.intervalSec * 1000);
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
  }

  addWatcher(id: string, callback: () => void) {
    this.watchers[id] = { callback };
  }

  removeWatcher(id: string) {
    delete this.watchers[id];
  }
}

export const autoRefreshService = new AutoRefreshService(60 /* sec */);
