import { createAtom } from '~utils/atoms';

export type ApplicationMode = 'Map' | 'Reports' | 'Events';

export const currentModeAtom = createAtom(
  {
    setCurrentMode: (mode: ApplicationMode) => mode,
  },
  ({ onAction }, state: ApplicationMode = 'Map') => {
    onAction('setCurrentMode', (mode) => (state = mode));

    return state;
  },
  'currentModeAtom',
);
