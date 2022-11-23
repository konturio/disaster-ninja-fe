import { createAtom } from '~core/store/atoms';

export const isDrawingStartedAtom = createAtom(
  { setIsStarted: (isStarted: boolean) => isStarted },
  ({ onAction }, started = false) => {
    onAction('setIsStarted', (value) => {
      started = value;
    });

    return started;
  },
);
