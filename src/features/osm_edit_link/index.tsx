import { EditOsm24 } from '@konturio/default-icons';
import {
  currentMapPositionAtom,
  currentUserAtom,
  toolbarControlsAtom,
} from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state';
import { i18n } from '~core/localization';
import configRepo from '~core/config';
import { URL_ZOOM_OFFSET } from '~core/constants';
import {
  DISABLE_CONTROL_TIMEOUT,
  EDIT_IN_OSM_CONTROL_ID,
  EDIT_IN_OSM_CONTROL_NAME,
} from './constants';

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
      }, DISABLE_CONTROL_TIMEOUT);

      const position = currentMapPositionAtom.getState();
      if (!position) return;
      if ('lat' in position && 'lng' in position && 'zoom' in position) {
        const { lat, lng, zoom } = position;
        const { osmEditor } = currentUserAtom.getState();
        if (!osmEditor) return;

        const baseLink =
          configRepo.get().osmEditors.find((editor) => editor.id === osmEditor)?.url ||
          'https://www.openstreetmap.org/edit?#map=';

        const url = `${baseLink}${zoom + URL_ZOOM_OFFSET}/${lat}/${lng}`;
        window.open(url)?.focus();
      }
    },
  });
}
