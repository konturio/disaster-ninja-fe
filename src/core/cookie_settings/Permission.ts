import type { CookiePermissionStatus } from './types';

export class Permission {
  readonly id: string;
  public status!: CookiePermissionStatus;

  constructor(id: string) {
    this.id = id;
  }
}

// const isStatus = (decision: string): decision is CookiePermissionStatus => {
//   return Object.values(cookiePermissionStatuses).includes(
//     decision as CookiePermissionStatus,
//   );
// };

// export class Permission {
//   static getStorageId = (id: string) => 'c_p_' + id;

//   readonly id: string;
//   private currentStatus: CookiePermissionStatus = cookiePermissionStatuses.promptNeeded;

//   constructor(id: string, strategy: CookiePermissionResolveStrategy) {
//     this.id = id;
//     this.restoreStatus() || this.setStatusFromStrategy(strategy);
//   }

//   restoreStatus() {
//     if (globalThis.localStorage) {
//       const savedDecision = globalThis.localStorage.getItem(
//         Permission.getStorageId(this.id),
//       );
//       if (savedDecision && isStatus(savedDecision)) {
//         this.status = savedDecision;
//         return true;
//       }
//     }
//     return false;
//   }

//   setStatusFromStrategy(strategy: CookiePermissionResolveStrategy) {
//     this.status = Permission.statusFromStrategy(strategy);
//   }

//   saveStoredPermission(id: string, status: CookiePermissionStatus) {
//     if (globalThis.localStorage) {
//       globalThis.localStorage.setItem(Permission.getStorageId(id), status);
//     }
//   }

//   set status(newStatus: CookiePermissionStatus) {
//     this.currentStatus = newStatus;
//   }

//   get status() {
//     return this.currentStatus;
//   }
// }
