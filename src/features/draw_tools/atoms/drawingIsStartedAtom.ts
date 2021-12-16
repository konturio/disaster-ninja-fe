import { createBindAtom } from '~utils/atoms/createBindAtom';

export const drawingIsStartedAtom = createBindAtom(
  { setIsStarted: (isStarted: boolean) => isStarted },
  ({ onAction }, started: boolean = false) => {
    onAction('setIsStarted', (value) => {
      started = value
    })

    return started
  },
)