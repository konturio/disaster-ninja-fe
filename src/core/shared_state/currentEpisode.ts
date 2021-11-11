import { createBindAtom } from '~utils/atoms/createBindAtom';

type CurrentEpisodeAtomState = {
  id: string;
} | null;

export const currentEpisodeAtom = createBindAtom(
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
