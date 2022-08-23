import { SelectArea24 } from '@konturio/default-icons';
import { toolbarControlsAtom } from '~core/shared_state';
import {
  BOUNDARY_SELECTOR_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_NAME,
  BOUNDARIES_BTN_TITLE_TRANSLATION_KEY,
  BOUNDARY_SELECTOR_LAYER_ID,
  BOUNDARY_GEOMETRY_COLOR,
  HOVERED_BOUNDARIES_SOURCE_ID,
} from '~features/boundary_selector/constants';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/toolbarControls';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { forceRun } from '~utils/atoms/forceRun';
import { BoundarySelectorRenderer } from './renderers/BoundarySelectorRenderer';
import { createBoundaryRegistryAtom } from './atoms/boundaryRegistryAtom';
import { boundaryMarkerAtom } from './atoms/boundaryMarkerAtom';
import { clickCoordinatesAtom } from './atoms/clickCoordinatesAtom';

let stopAll = () => {
  /* noop */
};

export function initBoundarySelector() {
  const renderer = new BoundarySelectorRenderer({
    layerId: BOUNDARY_SELECTOR_LAYER_ID,
    sourceId: HOVERED_BOUNDARIES_SOURCE_ID,
    color: BOUNDARY_GEOMETRY_COLOR,
  });

  const boundaryRegistryAtom = createBoundaryRegistryAtom(
    BOUNDARY_SELECTOR_LAYER_ID,
    renderer,
  );

  toolbarControlsAtom.addControl.dispatch({
    id: BOUNDARY_SELECTOR_CONTROL_ID,
    name: BOUNDARY_SELECTOR_CONTROL_NAME,
    title: i18n.t(BOUNDARIES_BTN_TITLE_TRANSLATION_KEY),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.withAnalytics,
    icon: <SelectArea24 />,
    onClick: (becomesActive) => {
      toolbarControlsAtom.toggleActiveState.dispatch(
        BOUNDARY_SELECTOR_CONTROL_ID,
      );
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        stopAll = forceRun([boundaryMarkerAtom, boundaryRegistryAtom]);
        store.dispatch([
          boundaryRegistryAtom.start(),
          clickCoordinatesAtom.start(),
          boundaryMarkerAtom.start(),
        ]);
      } else {
        store.dispatch([
          boundaryRegistryAtom.stop(),
          clickCoordinatesAtom.stop(),
          boundaryMarkerAtom.stop(),
        ]);
        stopAll();
      }
    },
  });
}
