/* In memory replacement for storage */
class FallbackStorage implements Storage {
  private storage = new Map();

  setItem(key: string, value: string): void {
    this.storage.set(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.get(key);
  }

  removeItem(key: string): void {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }

  get length() {
    return this.storage.size;
  }

  key(index: number): string | null {
    return this.storage.keys()[index] ?? null;
  }
}

class StableStorage implements Storage {
  storage: Storage;

  private storageAvailable(type: 'localStorage' | 'sessionStorage') {
    try {
      const storage = globalThis[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      console.warn(`${type} in not available.`);
    }
  }

  constructor(type: 'localStorage' | 'sessionStorage') {
    if (this.storageAvailable(type)) {
      this.storage = globalThis[type];
    } else {
      console.warn('Switching to in memory storage');
      this.storage = new FallbackStorage();
    }
  }

  setItem(key: string, value: string) {
    return this.storage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  get length() {
    return this.storage.length;
  }

  clear(): void {
    return this.storage.clear();
  }
  key(index: number): string | null {
    return this.storage.key(index);
  }
  removeItem(key: string): void {
    return this.storage.removeItem(key);
  }
}

export const sessionStorage = new StableStorage('sessionStorage');
export const localStorage = new StableStorage('localStorage');
