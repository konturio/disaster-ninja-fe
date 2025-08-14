/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { test, expect, vi } from 'vitest';

vi.mock('~features/toolbar/hooks/use-toolbar-content', () => ({
  useToolbarContent: () => [
    {
      buttons: [
        {
          id: 'test-control',
          settings: {} as any,
          stateAtom: {} as any,
        },
      ],
    },
  ],
}));

vi.mock('../ToolbarControl/ToolbarControl', () => ({
  ToolbarControl: ({ id }: { id: string }) => (
    <div data-testid={id} style={{ width: '300px' }} />
  ),
}));

vi.mock('../ToolbarButton/ToolbarButton', () => ({
  ToolbarButton: () => <div />,
}));

vi.mock('@konturio/default-icons', () => ({}));
vi.mock('@konturio/default-icons/tslib/index.js', () => ({}));

test('scrollLeft changes on vertical wheel events', async () => {
  const { ToolbarContent } = await import('./ToolbarContent');
  const { getByTestId } = render(<ToolbarContent />);
  const scroll = getByTestId('toolbar-content');

  Object.defineProperty(scroll, 'scrollWidth', { value: 300, configurable: true });
  Object.defineProperty(scroll, 'clientWidth', { value: 100, configurable: true });

  scroll.dispatchEvent(new WheelEvent('wheel', { deltaY: 50, bubbles: true }));

  expect(
    (scroll as HTMLDivElement).scrollLeft > 0,
    `scrollLeft should change after wheel event, got ${(scroll as HTMLDivElement).scrollLeft}`,
  ).toBe(true);
});
