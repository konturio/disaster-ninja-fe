import { currentMapPositionAtom, currentUserAtom } from '~core/shared_state';
import { toolbar } from '~core/toolbar';
import { i18n } from '~core/localization';
import { configRepo } from '~core/config';
import { store } from '~core/store/store';
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from './constants';
import { openOsmLink } from './openOsmLink';

export const osmEditControl = toolbar.setupControl({
  id: EDIT_IN_OSM_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: EDIT_IN_OSM_CONTROL_NAME,
    hint: i18n.t('sidebar.edit_osm'),
    icon: 'EditOsm24',
    preferredSize: 'tiny',
  },
});

osmEditControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    try {
      const position = store.getState(currentMapPositionAtom);
      if (!position) throw Error('Unknown position');
      const { osmEditor } = store.getState(currentUserAtom);
      if (!osmEditor) throw Error('Unknown editor');

      const editor = configRepo
        .get()
        .osmEditors.find((editor) => editor.id === osmEditor);

      switch (position.type) {
        case 'centerZoom':
          openOsmLink(position, editor?.url);
          break;

        default:
          throw Error('Unknown position type');
      }
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
