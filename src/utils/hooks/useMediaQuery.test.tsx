/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import { useMediaQuery, IS_MOBILE_QUERY } from './useMediaQuery';

function TestComp({ query }: { query: string }) {
  const matches = useMediaQuery(query);
  return <span data-testid="val">{String(matches)}</span>;
}

describe('useMediaQuery', () => {
  let width: number;

  beforeEach(() => {
    width = 1200;
    window.matchMedia = vi.fn((q: string) => ({
      matches: width <= parseInt(q.match(/\d+/)?.[0] ?? '0'),
      media: q,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  test('updates on resize event', () => {
    vi.useFakeTimers();
    const { getByTestId } = render(<TestComp query={IS_MOBILE_QUERY} />);
    expect(getByTestId('val').textContent).toBe('false');

    width = 500;
    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.runAllTimers();
    });
    expect(getByTestId('val').textContent).toBe('true');
    vi.useRealTimers();
  });
});
