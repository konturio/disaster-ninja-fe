import type { Permission } from './Permission';
import type { CookiePermissionStatus } from './types';

export type PermissionStatusListener = (status: CookiePermissionStatus) => void;

export class PermissionStatusWatcher {
  private listeners = new Set<PermissionStatusListener>();
  private permission: Permission;

  constructor(permission: Permission) {
    this.permission = permission;
  }

  statusChanged(newStatus: CookiePermissionStatus) {
    this.listeners.forEach((cb) => cb(newStatus));
  }

  onStatusChange(statusChangeCb: (status: CookiePermissionStatus) => void) {
    this.listeners.add(statusChangeCb);
    return () => this.listeners.delete(statusChangeCb);
  }

  get id() {
    return this.permission.id;
  }

  get status() {
    return this.permission.status;
  }

  set status(newStatus: CookiePermissionStatus) {
    this.permission.status = newStatus;
    this.listeners.forEach((cb) => cb(newStatus));
  }
}
