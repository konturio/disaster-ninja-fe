/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { describe, beforeEach, test, expect, vi } from 'vitest';
import { useAutoCollapsePanel, COLLAPSE_PANEL_QUERY } from './useAutoCollapsePanel';

function TestComp({ open, onClose }: { open: boolean; onClose: () => void }) {
  useAutoCollapsePanel(open, onClose, COLLAPSE_PANEL_QUERY);
  return null;
}

describe('useAutoCollapsePanel', () => {
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

  test('closes panel when query matches', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<TestComp open={true} onClose={onClose} />);
    width = 500;
    act(() => {
      window.dispatchEvent(new Event('resize'));
      vi.runAllTimers();
    });
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
