import { createAtom } from '@reatom/core';

type CurrentEpisodeAtomState = {
  id: string;
} | null;

export const currentEpisodeAtom = createAtom(
  {
    setCurrentEpisodeId: (episodeId: string) => episodeId,
    unsetCurrentEpisodeId: () => null,
  },
  ({ onAction }, state: CurrentEpisodeAtomState = null) => {
    onAction('setCurrentEpisodeId', (episodeId) => (state = { id: episodeId }));
    onAction('unsetCurrentEpisodeId', () => (state = null));
    return state;
  },
);
