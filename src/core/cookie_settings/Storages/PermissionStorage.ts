import { AppStorage } from '../AppStorage';
import type { PermissionStatusWatcher } from '../PermissionStatusWatcher';
import type { CookiePermissionStatus } from '../types';

export class PermissionStorage {
  private storage = new AppStorage<CookiePermissionStatus>('kontur_ccs');

  restorePermission(watchedPermission: PermissionStatusWatcher) {
    const savedStatus = this.storage.get(watchedPermission.id);
    if (savedStatus) watchedPermission.status = savedStatus;
  }

  persistPermission(watchedPermission: PermissionStatusWatcher) {
    watchedPermission.onStatusChange((status) => {
      this.storage.set(watchedPermission.id, status);
    });
  }
}
