import { currentUserAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { configRepo } from '~core/config';
import { store } from '~core/store/store';
import { DEFAULT_OSM_EDITOR } from '~core/constants';
import { currentMapPositionAtom } from '~core/shared_state/currentMapPosition';
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from './constants';
import { openOsmLink, openJosmLink } from './openOsmLink';

export const osmEditControl = toolbar.setupControl({
  id: EDIT_IN_OSM_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: EDIT_IN_OSM_CONTROL_NAME,
    hint: EDIT_IN_OSM_CONTROL_NAME,
    icon: 'EditInOsm16',
    preferredSize: 'tiny',
  },
});

osmEditControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    try {
      const position = store.v3ctx.get(currentMapPositionAtom);
      if (!position) throw Error('Unknown position');
      const { osmEditor = DEFAULT_OSM_EDITOR } = store.getState(currentUserAtom);

      const editor = configRepo
        .get()
        .osmEditors.find((editor) => editor.id === osmEditor);

      if (!('lng' in position)) throw Error('Unknown position type');

      if (editor?.id === 'josm') {
        openJosmLink(position, editor?.url);
      } else openOsmLink(position, editor?.url);
    } catch (e) {
      console.error(e);
    } finally {
      store.dispatch(osmEditControl.setState('regular'));
    }
  }
});

export function initOsmEditLink() {
  osmEditControl.init();
}
