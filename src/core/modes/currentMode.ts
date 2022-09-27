import { createAtom } from '~utils/atoms';

export type ApplicationMode =
  | 'map'
  | 'reports'
  | 'event'
  | 'bivariateManager'
  | 'profile';

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
