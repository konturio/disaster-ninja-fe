import { createBindAtom } from '~utils/atoms';
import { focusedGeometryVisibilityAtom } from '~core/shared_state';
import { focusedGeometryLayerAtom } from './focusedGeometryLayer';

export const visibilityWatcherAtom = createBindAtom(
  { focusedGeometryVisibilityAtom },
  ({ onChange, getUnlistedState, schedule }, state = null) => {
    const { isVisible: layerIsVisible } = getUnlistedState(
      focusedGeometryLayerAtom,
    );
    onChange('focusedGeometryVisibilityAtom', (shouldBeVisible) => {
      if (!layerIsVisible && shouldBeVisible) {
        schedule((dispatch) => dispatch(focusedGeometryLayerAtom.unhide()));
      } else if (layerIsVisible && !shouldBeVisible)
        schedule((dispatch) => dispatch(focusedGeometryLayerAtom.hide()));
    });
    return state;
  },
);
