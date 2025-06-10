/**
 * @vitest-environment happy-dom
 */
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { usePersistentError } from './usePersistentError';

describe('usePersistentError', () => {
  it('keeps value for specified time', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePersistentError<{ msg?: string }>(5000));

    act(() => {
      result.current.setPersistentError({ msg: 'test' });
    });
    expect(result.current.error.msg).toBe('test');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.error.msg).toBe('test');

    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.error.msg).toBeUndefined();
    vi.useRealTimers();
  });
});
