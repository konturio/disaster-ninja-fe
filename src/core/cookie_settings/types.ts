import type { ValuesType } from 'utility-types';
import type { permissionStatuses, permissionStrategy } from './constants';

export type CookiePermissionResolveStrategy = ValuesType<typeof permissionStrategy>;
export type CookiePermissionStatus = ValuesType<typeof permissionStatuses>;
export type CookiePermission = {
  id: string;
  status: CookiePermissionStatus;
};
