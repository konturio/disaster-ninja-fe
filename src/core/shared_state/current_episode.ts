import { createAtom } from '@reatom/core';

type CurrentEpisodeAtomState = {
  id: string;
} | null;

export const currentEpisodeAtom = createAtom(
  {
    setCurrentEpisodeId: (episodeId: string) => episodeId,
  },
  ({ onAction }, state: CurrentEpisodeAtomState = null) => {
    onAction('setCurrentEpisodeId', (episodeId) => (state = { id: episodeId }));
    return state;
  },
);
