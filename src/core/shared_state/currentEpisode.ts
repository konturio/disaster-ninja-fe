import { createAtom } from '~utils/atoms';

type CurrentEpisodeAtomState = {
  id: string;
} | null;

export const currentEpisodeAtom = createAtom(
  {
    setCurrentEpisodeId: (episodeId: string) => episodeId,
    resetCurrentEpisodeId: () => null,
  },
  ({ onAction }, state: CurrentEpisodeAtomState = null) => {
    onAction('setCurrentEpisodeId', (episodeId) => (state = { id: episodeId }));
    onAction('resetCurrentEpisodeId', () => (state = null));
    return state;
  },
  '[Shared state] currentEpisodeAtom',
);
