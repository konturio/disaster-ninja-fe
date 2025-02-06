/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { wait } from '../test';
import { createStateMap } from './createStateMap';

const createIsolatedContainer = () =>
  document.body.appendChild(document.createElement('div'));

test('Show loading state', () => {
  const statesToComponents = createStateMap({
    error: null,
    loading: true,
    data: null,
  });
  const component = statesToComponents({
    ready: () => null,
    loading: <>Preloader</>,
  });

  expect(component).toEqual(<>Preloader</>);
});

test('Replace init state with loading after delay', async () => {
  const statesToComponents = createStateMap(
    {
      error: null,
      loading: true,
      data: null,
    },
    { loadingStateDelayMs: 1000 },
  );

  const component = statesToComponents({
    init: <>Init</>,
    ready: () => null,
    loading: <>Preloader</>,
  });
  render(<>{component}</>, {
    container: createIsolatedContainer(),
  });
  expect(screen.getByText(/Init/i)).toBeDefined();
  await wait(2);
  expect(screen.getByText(/Preloader/i)).toBeDefined();
});

test('Replace ready state with loading after delay', async () => {
  const statesToComponents = createStateMap(
    { error: null, loading: true, data: {} },
    { loadingStateDelayMs: 100 },
  );

  const { unmount } = render(
    <>
      {statesToComponents({
        init: <>Init</>,
        loading: <>Preloader</>,
        ready: () => <>Data</>,
      })}
    </>,
    { container: createIsolatedContainer() },
  );

  await screen.findByText(/Data/i);
  await screen.findByText(/Preloader/i, {}, { timeout: 200 });

  unmount();
});
