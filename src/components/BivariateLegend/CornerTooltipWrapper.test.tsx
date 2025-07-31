/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

// Replace Tooltip with simple implementation for tests
vi.mock('../Overlays/Tooltip', () => ({
  Tooltip: ({ isOpen, content }) =>
    isOpen ? <div data-testid="tooltip">{content}</div> : null,
}));

vi.mock('~core/localization', () => ({
  i18n: { t: (k: string) => k },
}));

import { CornerTooltipWrapper } from './CornerTooltipWrapper';

function FakeLegend(props: any) {
  return (
    <div
      data-testid="cell"
      onPointerOver={(e) => props.onCellPointerOver(e, {}, 0)}
      onPointerLeave={props.onCellPointerLeave}
    >
      cell
    </div>
  );
}

describe('CornerTooltipWrapper', () => {
  test('shows tooltip when hovering corner cell', () => {
    const hints = {
      x: { label: 'x', direction: [['a'], ['b']] },
      y: { label: 'y', direction: [['c'], ['d']] },
    } as any;
    const { getByTestId, queryByTestId } = render(
      <CornerTooltipWrapper hints={hints}>
        <FakeLegend />
      </CornerTooltipWrapper>,
    );
    expect(queryByTestId('tooltip')).toBeNull();
    fireEvent.pointerOver(getByTestId('cell'));
    expect(queryByTestId('tooltip')).toBeTruthy();
    fireEvent.pointerLeave(getByTestId('cell'));
    expect(queryByTestId('tooltip')).toBeNull();
  });
});
