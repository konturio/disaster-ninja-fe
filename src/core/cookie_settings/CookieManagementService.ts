import { permissionStatuses, permissionStrategy } from './constants';
import { Permission } from './Permission';
import { PermissionStatusWatcher } from './PermissionStatusWatcher';
import { PermissionStorage } from './Storages/PermissionStorage';
import { StrategyStorage } from './Storages/StrategyStorage';
import type { CookiePermissionResolveStrategy, CookiePermissionStatus } from './types';

type SettingsListener = (p: Map<string, Permission>) => void;

export class CookieManagementService {
  private permissions = new Map<string, PermissionStatusWatcher>();
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

  readonly debounceTime: number;

  constructor(debounceTime = 300) {
    this.debounceTime = debounceTime;
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

  debounceTimer?: NodeJS.Timeout;
  callListeners() {
    this.debounceTimer && clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.cookieSettingsListeners.forEach((listener) => listener(this.permissions));
    }, this.debounceTime);
  }

  private cookieSettingsListeners = new Set<SettingsListener>();
  private watch(permission: PermissionStatusWatcher) {
    permission.onStatusChange(() => {
      this.callListeners();
    });
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
      this.permissions.set(id, watchedPermission);
      this.watch(watchedPermission);
      this.strategy = this.strategyStorage.restoreStrategy() ?? this.strategy;
      this.applyStrategy(watchedPermission, this.strategy);
      this.callListeners();
      return watchedPermission;
    } else {
      return this.permissions.get(id)!;
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

  onPermissionsChange(cb: SettingsListener) {
    this.cookieSettingsListeners.add(cb);
    return () => this.cookieSettingsListeners.delete(cb);
  }

  havePrompts() {
    for (const permission of this.permissions.values()) {
      if (permission.status === permissionStatuses.promptNeeded) {
        return true;
      }
    }
    return false;
  }
}
