/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChooseEditModeModal from './ChooseEditModeModal';

describe('ChooseEditModeModal', () => {
  it('confirms draw mode when Draw new geometry clicked', async () => {
    const onConfirm = vi.fn();
    render(<ChooseEditModeModal onConfirm={onConfirm} />);
    await userEvent.click(
      screen.getByRole('button', { name: /Draw new geometry/i })
    );
    expect(
      onConfirm,
      'onConfirm should be called with "draw" when Draw new geometry is selected'
    ).toHaveBeenCalledWith('draw');
  });

  it('confirms edit mode when Edit existing geometry clicked', async () => {
    const onConfirm = vi.fn();
    render(<ChooseEditModeModal onConfirm={onConfirm} />);
    await userEvent.click(
      screen.getByRole('button', { name: /Edit existing geometry/i })
    );
    expect(
      onConfirm,
      'onConfirm should be called with "edit" when Edit existing geometry is selected'
    ).toHaveBeenCalledWith('edit');
  });
});
