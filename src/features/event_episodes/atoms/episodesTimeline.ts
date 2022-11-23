import { createAtom } from '~core/store/atoms';

const timelineKey = Symbol('TimelineImplementationKey');

interface EpisodesTimeline {
  [timelineKey]: unknown | null;
  settings: {
    stack: boolean;
    cluster: false | { fitOnDoubleClick: true };
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
        cluster: { fitOnDoubleClick: true },
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
