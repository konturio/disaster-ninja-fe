/**
 * @vitest-environment happy-dom
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { createStore } from '@reatom/core-v2';
import { reatomContext } from '@reatom/react-v2';
import { vi, test, expect } from 'vitest';
import { currentEpisodeAtom } from '../../../../core/shared_state';
import { EpisodesTimeline } from './EpisodesTimeline';
import type { Episode } from '~core/types';

const focus = vi.fn();
const setSelection = vi.fn();

vi.mock('@konturio/ui-kit', () => ({
  Timeline: forwardRef((_props: any, ref) => {
    useImperativeHandle(ref, () => ({ focus, setSelection }));
    return <div data-testid="timeline" />;
  }),
}));

test('focuses timeline on current episode and selects it', async () => {
  const episodes: Episode[] = [
    {
      id: '1',
      name: 'ep',
      externalUrls: [],
      severity: '',
      startedAt: '2024-01-01T00:00:00Z',
      endedAt: '2024-01-01T01:00:00Z',
      updatedAt: '2024-01-01T01:00:00Z',
      geojson: { type: 'FeatureCollection', features: [] },
      location: '',
      forecasted: false,
    },
  ];

  const store = createStore();

  render(
    <reatomContext.Provider value={store}>
      <EpisodesTimeline episodes={episodes} />
    </reatomContext.Provider>,
  );

  act(() => {
    store.dispatch(currentEpisodeAtom.set('1'));
  });

  await waitFor(() => {
    expect(
      setSelection,
      'timeline selection should include current episode id 1',
    ).toHaveBeenCalledWith(['1']);
  });
  await waitFor(() => {
    expect(focus, 'timeline should focus on current episode id 1').toHaveBeenCalledWith(
      '1',
    );
  });
});
