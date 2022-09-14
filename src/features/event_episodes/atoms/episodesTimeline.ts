import { createAtom } from '~utils/atoms';

const timelineKey = Symbol('TimelineImplementationKey');

interface EpisodesTimeline {
  [timelineKey]: unknown | null;
  settings: {
    stack: boolean;
    cluster: boolean;
  };
}

export const episodesTimeline = createAtom(
  {
    setImperativeApi: (api) => api,
    resetZoom: () => null,
    patchSettings: (patch: Partial<EpisodesTimeline['settings']>) => patch,
    setData: (data: unknown) => data,
  },
  (
    { onAction },
    state: EpisodesTimeline = {
      [timelineKey]: null,
      settings: {
        stack: false,
        cluster: true,
      },
    },
  ) => {
    onAction('setImperativeApi', (api) => (state = { ...state, [timelineKey]: api }));
    onAction(
      'patchSettings',
      (patch) =>
        (state = {
          ...state,
          settings: {
            ...state.settings,
            ...patch,
          },
        }),
    );
    return state;
  },
  'episodesTimeline',
);
