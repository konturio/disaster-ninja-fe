/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import commonStyles from '../commonStyles.module.css';

vi.mock('@konturio/default-icons', () => ({
  ChevronRight16: () => <span>{'>'}</span>,
}));
vi.mock('@konturio/ui-kit', () => ({
  Text: ({ children }: any) => <span>{children}</span>,
  Menu: ({ children }: any) => <div>{children}</div>,
  MenuButton: ({ children }: any) => <button>{children}</button>,
  MenuItem: ({ children, onSelect }: any) => <div onClick={onSelect}>{children}</div>,
  MenuList: ({ children }: any) => <div>{children}</div>,
  Panel: ({ children }: any) => <div>{children}</div>,
}));

const items = [
  { label: 'A', value: 'a' },
  { label: 'B', value: 'b' },
];

test('shows trailing arrow while loading', () => {
  const { container } = render(<Breadcrumbs items={items} onClick={() => {}} loading />);
  const separators = container.querySelectorAll(`.${commonStyles.separator}`);
  expect(separators.length, 'loading should render arrow after the last breadcrumb').toBe(
    items.length,
  );
});

test('omits trailing arrow when idle', () => {
  const { container } = render(
    <Breadcrumbs items={items} onClick={() => {}} loading={false} />,
  );
  const separators = container.querySelectorAll(`.${commonStyles.separator}`);
  expect(separators.length, 'without loading there should be one fewer separator').toBe(
    items.length - 1,
  );
});
