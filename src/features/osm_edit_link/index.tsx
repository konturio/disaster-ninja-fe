import { EditOsm24 } from '@konturio/default-icons';
import {
  currentMapPositionAtom,
  currentUserAtom,
  toolbarControlsAtom,
} from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state';
import { i18n } from '~core/localization';
import app_config from '~core/app_config';
import { URL_ZOOM_OFFSET } from '~core/constants';
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from './constants';

export function initOsmEditLink() {
  toolbarControlsAtom.addControl.dispatch({
    id: EDIT_IN_OSM_CONTROL_ID,
    name: EDIT_IN_OSM_CONTROL_NAME,
    title: i18n.t('sidebar.edit_osm'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    exclusiveGroup: controlGroup.mapTools,
    icon: <EditOsm24 />,
    onClick: () => {
      toolbarControlsAtom.enable.dispatch(EDIT_IN_OSM_CONTROL_ID);
      setTimeout(() => {
        toolbarControlsAtom.disable.dispatch(EDIT_IN_OSM_CONTROL_ID);
      }, 3000);
      const position = currentMapPositionAtom.getState();
      if (!position) return;
      const { lat, lng, zoom } = position;
      const { osmEditor } = currentUserAtom.getState();
      if (!osmEditor) return;
      const baseLink =
        app_config.osmEditors.find((editor) => editor.id === osmEditor)?.url ||
        'https://www.openstreetmap.org/edit?#map=';

      const url = `${baseLink}${zoom + URL_ZOOM_OFFSET}/${lat}/${lng}`;
      window.open(url)?.focus();
    },
  });
}
