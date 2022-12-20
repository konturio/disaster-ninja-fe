import { vi, test, expect, describe } from 'vitest';
import { wait } from '~utils/test';
import { CookieManagementService } from './CookieManagementService';
import { PermissionStatusWatcher } from './PermissionStatusWatcher';

test('Create permission for request', () => {
  const cms = new CookieManagementService();
  const permission = cms.requestPermission('test_id');
  expect(permission, 'Create permission').toBeInstanceOf(PermissionStatusWatcher);
  const samePermission = cms.requestPermission('test_id');
  expect(samePermission, 'Not create new permission with same id').toBe(permission);
});

test('Notify when any permission changed', async () => {
  const cms = new CookieManagementService();
  const cb = vi.fn();
  const waitDebounce = () => wait(cms.debounceTime / 1000);
  cms.onPermissionsChange(cb);

  const perm = cms.requestPermission('test_id');
  await waitDebounce();
  expect(cb, 'Call when permission added').toHaveBeenCalled();

  perm.status = 'denied';
  await waitDebounce();
  expect(cb, 'Call after change status').toHaveBeenCalledTimes(2);

  const anotherPermission = cms.requestPermission('test_id_2');
  anotherPermission.status = 'denied';
  await waitDebounce();
  expect(cb, 'Debounce permission changes calls').toHaveBeenCalledTimes(3);
});

test('Calculate permissions that wait prompts', () => {
  const cms = new CookieManagementService();

  const perm = cms.requestPermission('test');
  expect(cms.havePrompts(), 'Case with have prompts').toBe(true);

  perm.status = 'granted';
  expect(cms.havePrompts(), `Case with haven't prompts`).toBe(false);
});

describe('Use strategies', () => {
  test('For existing strategies', () => {
    const cms = new CookieManagementService();
    const perm = cms.requestPermission('test');

    cms.acceptAll();
    expect(perm.status, 'acceptAll strategy').toBe('granted');

    cms.rejectAll();
    expect(perm.status, 'rejectAll strategy').toBe('denied');
  });

  test('For future strategies', () => {
    const cms = new CookieManagementService();

    cms.acceptAll();
    const perm = cms.requestPermission('test');
    expect(perm.status, 'acceptAll strategy').toBe('granted');

    cms.rejectAll();
    const perm2 = cms.requestPermission('test2');
    expect(perm2.status, 'rejectAll strategy').toBe('denied');
  });
});
