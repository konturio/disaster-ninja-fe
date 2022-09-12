import { createAtom } from '~utils/atoms';

export type CurrentEpisodeAtomState = {
  id: string;
} | null;

export const currentEpisodeAtom = createAtom(
  {
    set: (episodeId: string) => episodeId,
    reset: () => null,
  },
  ({ onAction }, state: CurrentEpisodeAtomState = null) => {
    onAction('set', (episodeId) => (state = { id: episodeId }));
    onAction('reset', () => (state = null));
    return state;
  },
  '[Shared state] currentEpisodeAtom',
);
