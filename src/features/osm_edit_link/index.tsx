import { EditOsm24 } from '@konturio/default-icons';
import {
  currentMapPositionAtom,
  sideControlsBarAtom,
} from '~core/shared_state';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';
import { i18n } from '~core/localization';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';
import { EDIT_IN_OSM_CONTROL_ID, EDIT_IN_OSM_CONTROL_NAME } from './constants';
import type { InitFeatureInterface } from '~utils/metrics/initFeature';

export function initOsmEditLink(reportReady) {
  sideControlsBarAtom.addControl.dispatch({
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

  reportReady();
}
/* eslint-disable react/display-name */
export const featureInterface: InitFeatureInterface = {
  affectsMap: false,
  id: AppFeature.OSM_EDIT_LINK,
  initFunction(reportReady) {
    initOsmEditLink(reportReady);
  },
};
