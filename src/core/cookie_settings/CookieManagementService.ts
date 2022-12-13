import { permissionStatuses, permissionStrategy } from './constants';
import { Permission } from './Permission';
import { PermissionStatusWatcher } from './PermissionStatusWatcher';
import { PermissionStorage } from './PermissionStorage';
import type { CookiePermissionResolveStrategy, CookiePermissionStatus } from './types';

export class CookieManagementService {
  private permissions = new Map<string, Permission>();
  private storage = new PermissionStorage();
  private strategy: CookiePermissionResolveStrategy = permissionStrategy.prompt;

  static statusFromStrategy(
    strategy: CookiePermissionResolveStrategy,
  ): CookiePermissionStatus {
    switch (strategy) {
      case permissionStrategy.resolveAll:
        return permissionStatuses.granted;

      case permissionStrategy.rejectAll:
        return permissionStatuses.denied;

      case permissionStrategy.prompt:
        return permissionStatuses.promptNeeded;
    }
  }

  private applyStrategy(
    permission: Permission,
    strategy: CookiePermissionResolveStrategy,
  ) {
    permission.status = CookieManagementService.statusFromStrategy(strategy);
  }

  requestPermission(id: string) {
    if (!this.permissions.has(id)) {
      const permission = new Permission(id);
      const watchedPermission = new PermissionStatusWatcher(permission);
      this.storage.restorePermission(watchedPermission);
      this.storage.persistPermission(watchedPermission);
      this.applyStrategy(watchedPermission, this.strategy);
      this.permissions.set(id, watchedPermission);
      return watchedPermission;
    } else {
      return this.permissions.get(id);
    }
  }

  acceptAll() {
    this.strategy = 'resolveAll';
    this.permissions.forEach((permission) => {
      permission.status = 'granted';
    });
  }

  rejectAll() {
    this.strategy = 'rejectAll';
    this.permissions.forEach((permission) => {
      permission.status = 'denied';
    });
  }
}
