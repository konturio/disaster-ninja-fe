/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@konturio/default-icons', () => ({
  Close16: () => <svg data-testid="icon" />,
}));
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover';

describe('Popover component', () => {
  test('opens and closes via trigger', () => {
    const { getByText, queryByText } = render(
      <Popover initialOpen={false}>
        <PopoverTrigger>
          <button>open</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>content</div>
          <PopoverClose>close</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    expect(queryByText('content')).toBeNull();
    fireEvent.click(getByText('open'));
    expect(queryByText('content')).toBeTruthy();
    fireEvent.click(getByText('close'));
    expect(queryByText('content')).toBeNull();
  });
});
