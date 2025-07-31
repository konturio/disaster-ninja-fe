/**
 * @vitest-environment happy-dom
 */
import React, { Suspense } from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { lazily } from 'react-lazily';

describe('lazily', () => {
  test('loads component asynchronously', async () => {
    const { LazyComp } = lazily(() =>
      Promise.resolve({ LazyComp: () => <div>lazy</div> }),
    );
    const { getByText } = render(
      <Suspense fallback={<div>loading</div>}>
        <LazyComp />
      </Suspense>,
    );
    await waitFor(() => expect(getByText('lazy')).toBeTruthy());
  });
});
