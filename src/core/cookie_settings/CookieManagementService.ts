import { permissionStatuses, permissionStrategy } from './constants';
import { Permission } from './Permission';
import { PermissionStatusWatcher } from './PermissionStatusWatcher';
import { PermissionStorage, StrategyStorage } from './Storage';
import type { CookiePermissionResolveStrategy, CookiePermissionStatus } from './types';

export class CookieManagementService {
  private permissions = new Map<string, Permission>();
  private permissionStorage = new PermissionStorage();
  private strategyStorage = new StrategyStorage();
  private currentStrategy: CookiePermissionResolveStrategy = permissionStrategy.prompt;

  static statusFromStrategy(
    strategy: CookiePermissionResolveStrategy,
  ): CookiePermissionStatus {
    switch (strategy) {
      case permissionStrategy.applyAll:
        return permissionStatuses.granted;

      case permissionStrategy.rejectAll:
        return permissionStatuses.denied;

      case permissionStrategy.prompt:
        return permissionStatuses.promptNeeded;
    }
  }

  /**
   * Strategy it kind of "fallback behavior"
   * For example - when user choose "Apply all"
   * This service will allow to use any cookies for feature requests
   */
  private applyStrategy(
    permission: Permission,
    strategy: CookiePermissionResolveStrategy,
  ) {
    permission.status = CookieManagementService.statusFromStrategy(strategy);
  }

  get strategy() {
    return this.currentStrategy;
  }

  set strategy(newStrategy: CookiePermissionResolveStrategy) {
    this.currentStrategy = newStrategy;
    this.strategyStorage.persistStrategy(newStrategy);
  }

  requestPermission(id: string) {
    if (!this.permissions.has(id)) {
      const permission = new Permission(id);
      const watchedPermission = new PermissionStatusWatcher(permission);
      this.permissionStorage.restorePermission(watchedPermission);
      this.permissionStorage.persistPermission(watchedPermission);
      this.strategy = this.strategyStorage.restoreStrategy() ?? this.strategy;
      this.applyStrategy(watchedPermission, this.strategy);
      this.permissions.set(id, watchedPermission);
      return watchedPermission;
    } else {
      return this.permissions.get(id);
    }
  }

  acceptAll() {
    this.strategy = permissionStrategy.applyAll;
    this.permissions.forEach((permission) => {
      permission.status = permissionStatuses.granted;
    });
  }

  rejectAll() {
    this.strategy = permissionStrategy.rejectAll;
    this.permissions.forEach((permission) => {
      permission.status = permissionStatuses.denied;
    });
  }

  havePrompts() {
    debugger;
    for (const permission of this.permissions.values()) {
      if (permission.status === permissionStatuses.promptNeeded) {
        return true;
      }
    }
    return false;
  }
}
