import { createBindAtom } from '~utils/atoms/createBindAtom';
import { ApplicationMap } from '~components/ConnectedMap/ConnectedMap';

/**
 * Atom to save current map ref and reuse it in other atoms
 */
export const currentMapAtom = createBindAtom(
  {
    setMap: (map?: ApplicationMap) => map,
    setInteractivity: (isOn: boolean) => isOn
  },
  ({ onAction }, state: ApplicationMap | undefined = undefined) => {
    onAction('setMap', (map?: ApplicationMap) => {
      state = map;
    });
    onAction('setInteractivity', interactive => {
      if (!state) return;
      const interactionIsON = state.dragPan.isActive();
      // Case interactive already
      if (interactive && interactionIsON) return;
      // Case turn on interactivity
      else if (interactive) {
        state.boxZoom.enable();
        state.doubleClickZoom.enable();
        state.dragPan.enable();
        state.dragRotate.enable();
        state.keyboard.enable();
        state.scrollZoom.enable();
        state.touchZoomRotate.enable();
      }
      // Case non-interactive already
      else if (!interactive && !interactionIsON) return;
      // Case turn off interactivity
      else {
        state.boxZoom.disable();
        state.doubleClickZoom.disable();
        state.dragPan.disable();
        state.dragRotate.disable();
        state.keyboard.disable();
        state.scrollZoom.disable();
        state.touchZoomRotate.disable();
      }
    })
    return state;
  },
  '[Shared state] currentMapAtom',
);
