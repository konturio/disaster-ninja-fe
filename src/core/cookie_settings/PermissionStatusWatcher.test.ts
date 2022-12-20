import { vi, test, expect } from 'vitest';
import { Permission } from './Permission';
import { PermissionStatusWatcher } from './PermissionStatusWatcher';

test('PermissionStatusWatcher notify about status changes', () => {
  const permission = new Permission('test');
  const permissionStatusWatcher = new PermissionStatusWatcher(permission);
  const cb = vi.fn();
  permissionStatusWatcher.onStatusChange(cb);
  expect(cb, 'Initial call with current state').toHaveBeenNthCalledWith(
    1,
    permission.status,
  );
  permissionStatusWatcher.status = 'granted';
  expect(cb, 'Call after new status').toHaveBeenNthCalledWith(2, 'granted');
  permissionStatusWatcher.status = 'granted';
  expect(cb, 'Skip call when no changes in status').toHaveBeenLastCalledWith('granted');
  expect(cb).toHaveBeenCalledTimes(2);
});
