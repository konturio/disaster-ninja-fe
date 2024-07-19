import { currentMapPositionAtom, currentUserAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { store } from '~core/store/store';
import {
  DEFAULT_OSM_EDITOR,
  EDIT_IN_OSM_CONTROL_ID,
  EDIT_IN_OSM_CONTROL_NAME,
} from './constants';
import { openOsmLink } from './openOsmLink';

export const osmEditControl = toolbar.setupControl({
  id: EDIT_IN_OSM_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: EDIT_IN_OSM_CONTROL_NAME,
    hint: i18n.t('sidebar.edit_osm'),
    icon: 'EditInOsm16',
    preferredSize: 'tiny',
  },
});

osmEditControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    try {
      const position = store.getState(currentMapPositionAtom);
      if (!position) throw Error('Unknown position');
      const { osmEditor = DEFAULT_OSM_EDITOR } = store.getState(currentUserAtom);

      const editor = configRepo
        .get()
        .osmEditors.find((editor) => editor.id === osmEditor);

      if ('lng' in position) {
        openOsmLink(position, editor?.url);
      } else throw Error('Unknown position type');
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
