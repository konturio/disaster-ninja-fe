import type { CookiePermissionStatus } from './types';

export class Permission {
  readonly id: string;
  public status!: CookiePermissionStatus;

  constructor(id: string) {
    this.id = id;
  }
}
