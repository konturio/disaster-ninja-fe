import { vi } from 'vitest';
import * as waitModule from '~utils/test/wait';

/**
 * Mock the wait function to resolve immediately
 * Useful for testing retry behavior and long-running operations without actual delays
 * @returns The spy object for verification
 */
export function mockWait() {
  return vi.spyOn(waitModule, 'wait').mockImplementation(() => Promise.resolve());
}

/**
 * Reset the wait mock to its original implementation
 */
export function resetWaitMock() {
  vi.mocked(waitModule.wait).mockReset();
}
