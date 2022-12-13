import type { PermissionStatusWatcher } from './PermissionStatusWatcher';
import type { CookiePermissionStatus } from './types';

class Storage {
  state: Record<string, CookiePermissionStatus> = {};

  constructor() {
    this.restoreState();
  }

  restoreState() {
    if (globalThis.localStorage) {
      const serializedState = globalThis.localStorage.get('kontur_ccs');
      try {
        this.state = JSON.parse(serializedState);
      } catch (error) {
        console.info('Failed to load  cookies settings', error);
      }
    }
  }

  interval: NodeJS.Timeout | null = null;
  persistState() {
    if (globalThis.localStorage) {
      this.interval && clearInterval(this.interval);
      this.interval = setInterval(() => {
        const serializedState = JSON.stringify(this.state);
        globalThis.localStorage.set('kontur_ccs', serializedState);
      }, 400);
    }
  }

  get(key: string): CookiePermissionStatus | null {
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

export class PermissionStorage {
  private storage = new Storage();

  restorePermission(watchedPermission: PermissionStatusWatcher) {
    watchedPermission.status = this.storage.get(watchedPermission.id);
  }

  persistPermission(watchedPermission: PermissionStatusWatcher) {
    watchedPermission.onStatusChange((status) => {
      this.storage.set(watchedPermission.id, status);
    });
  }
}
