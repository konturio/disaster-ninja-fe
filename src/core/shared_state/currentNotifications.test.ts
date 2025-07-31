/**
 * @vitest-environment happy-dom
 */
import { describe, test, expect, vi } from 'vitest';
import { currentNotificationAtom } from './currentNotifications';

// nanoid should generate predictable IDs so we can assert on them
vi.mock('nanoid', () => ({ nanoid: () => 'TEST' }));

describe('currentNotificationAtom', () => {
  test('adds and removes notifications', () => {
    // Initially there should be no notifications
    expect(currentNotificationAtom.getState()).toEqual([]);

    currentNotificationAtom.showNotification.dispatch('info', { title: 'Hello' }, 1);

    const [notif] = currentNotificationAtom.getState();
    expect(notif.id).toBe('TEST');
    expect(notif.type).toBe('info');
    expect(notif.message.title).toBe('Hello');

    // calling onClose should remove it from state
    notif.onClose();
    expect(currentNotificationAtom.getState()).toEqual([]);
  });
});
