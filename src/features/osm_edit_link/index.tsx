import { EditOsm24 } from '@konturio/default-icons';
import {
  currentMapPositionAtom,
  toolbarControlsAtom,
} from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from './constants';

export function initOsmEditLink() {
  toolbarControlsAtom.addControl.dispatch({
    id: EDIT_IN_OSM_CONTROL_ID,
    name: EDIT_IN_OSM_CONTROL_NAME,
    title: i18n.t('Edit in OpenStreetMap'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <EditOsm24 />,
    onClick: () => {
      const position = currentMapPositionAtom.getState();
      if (!position) return;
      const { lat, lng, zoom } = position;
      const url = `https://www.openstreetmap.org/edit?#map=${zoom}/${lat}/${lng}`;
      window.open(url)?.focus();
    },
  });
}
