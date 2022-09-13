import { createAtom } from '~utils/atoms';

export const episodesPanelState = createAtom(
  {
    open: () => null,
    close: () => null,
  },
  ({ onAction }, state = { isOpen: false }) => {
    onAction('open', () => (state = { ...state, isOpen: true }));
    onAction('close', () => (state = { ...state, isOpen: false }));

    return state;
  },
  'episodesPanelState',
);
