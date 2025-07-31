/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { useOutsideClick } from './useOutsideClick';

function TestComp({ cb }: { cb: () => void }) {
  const ref = useOutsideClick<HTMLDivElement>(cb);
  return (
    <div>
      <div data-testid="inside" ref={ref}>
        inside
      </div>
      <div data-testid="outside">outside</div>
    </div>
  );
}

test('callback triggers on outside clicks only', () => {
  const cb = vi.fn();
  const { getByTestId } = render(<TestComp cb={cb} />);
  fireEvent.click(getByTestId('inside'));
  expect(cb).not.toHaveBeenCalled();
  fireEvent.click(getByTestId('outside'));
  expect(cb).toHaveBeenCalledTimes(1);
});
