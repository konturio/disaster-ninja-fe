import { createAtom } from '~utils/atoms';

export type ApplicationMode = 'map' | 'about' | 'reports' | 'event' | 'bivariateManager';

export const currentModeAtom = createAtom(
  {
    setCurrentMode: (mode: ApplicationMode) => mode,
  },
  ({ onAction }, state: ApplicationMode = 'map') => {
    onAction('setCurrentMode', (mode) => (state = mode));

    return state;
  },
  'currentModeAtom',
);
