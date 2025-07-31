/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, test, expect } from 'vitest';
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

describe('createRoot', () => {
  test('mounts component', () => {
    const el = document.createElement('div');
    const root = createRoot(el);
    act(() => {
      root.render(<span>ok</span>);
    });
    expect(el.innerHTML).toContain('ok');
  });
});
