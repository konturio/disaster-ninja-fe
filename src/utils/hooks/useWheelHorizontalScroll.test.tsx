/**
 * @vitest-environment happy-dom
 */
import React, { useRef } from 'react';
import { render } from '@testing-library/react';
import { test, expect } from 'vitest';
import { useWheelHorizontalScroll } from './useWheelHorizontalScroll';

function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  useWheelHorizontalScroll(ref);
  return (
    <div ref={ref} data-testid="scroll" style={{ overflowX: 'auto', width: '100px' }}>
      <div style={{ width: '300px' }}>content</div>
    </div>
  );
}

test('scrollLeft changes on vertical wheel events', () => {
  const { getByTestId } = render(<Demo />);
  const scroll = getByTestId('scroll') as HTMLDivElement;

  Object.defineProperty(scroll, 'scrollWidth', { value: 300, configurable: true });
  Object.defineProperty(scroll, 'clientWidth', { value: 100, configurable: true });

  scroll.dispatchEvent(new WheelEvent('wheel', { deltaY: 50, bubbles: true }));

  expect(
    scroll.scrollLeft > 0,
    `scrollLeft should change after wheel event, got ${scroll.scrollLeft}`,
  ).toBe(true);
});
