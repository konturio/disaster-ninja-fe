/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import { i18n } from '../../../../core/localization';
import { EmptyState } from './EmptyState';

vi.mock('@konturio/ui-kit', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

test('renders hint when geometry is missing', () => {
  render(<EmptyState hasGeometry={false} />);
  const expectedText = i18n.t('layer_features_panel.empty');
  expect(
    screen.getByText(expectedText),
    'EmptyState should hint about selecting area when geometry is absent',
  ).toBeDefined();
});

test('renders no features message when geometry is present', () => {
  render(<EmptyState hasGeometry={true} />);
  const expectedText = i18n.t('layer_features_panel.no_features');
  expect(
    screen.getByText(expectedText),
    'EmptyState should show absence of layer features when geometry exists',
  ).toBeDefined();
});
