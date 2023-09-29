import {
  BOUNDARY_SELECTOR_CONTROL_ID,
  BOUNDARY_SELECTOR_CONTROL_NAME,
  BOUNDARY_SELECTOR_LAYER_ID,
  BOUNDARY_GEOMETRY_COLOR,
  HOVERED_BOUNDARIES_SOURCE_ID,
} from '~features/boundary_selector/constants';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { forceRun } from '~utils/atoms/forceRun';
import { toolbar } from '~core/toolbar';
import { BoundarySelectorRenderer } from './renderers/BoundarySelectorRenderer';
import { createBoundaryRegistryAtom } from './atoms/boundaryRegistryAtom';
import { boundaryMarkerAtom } from './atoms/boundaryMarkerAtom';
import { clickCoordinatesAtom } from './atoms/clickCoordinatesAtom';

export const boundarySelectorControl = toolbar.setupControl({
  id: BOUNDARY_SELECTOR_CONTROL_ID,
  type: 'button',
  typeSettings: {
    name: BOUNDARY_SELECTOR_CONTROL_NAME,
    hint: i18n.t('boundary_selector.title'),
    icon: 'SelectArea24',
    preferredSize: 'small',
  },
  onInit: () => {
    const renderer = new BoundarySelectorRenderer({
      layerId: BOUNDARY_SELECTOR_LAYER_ID,
      sourceId: HOVERED_BOUNDARIES_SOURCE_ID,
      color: BOUNDARY_GEOMETRY_COLOR,
    });

    const boundaryRegistryAtom = createBoundaryRegistryAtom(
      BOUNDARY_SELECTOR_LAYER_ID,
      renderer,
    );

    const ctx = {
      boundaryRegistryAtom,
      unsubscribe: forceRun([boundaryMarkerAtom, boundaryRegistryAtom]),
    };

    return ctx;
  },
  onStateChange: (state, ctx) => {
    switch (state) {
      case 'active':
        store.dispatch([
          ctx.boundaryRegistryAtom.start(),
          clickCoordinatesAtom.start(),
          boundaryMarkerAtom.start(),
        ]);
        break;

      default:
        store.dispatch([
          ctx.boundaryRegistryAtom.stop(),
          clickCoordinatesAtom.stop(),
          boundaryMarkerAtom.stop(),
        ]);
    }
  },
  onRemove(ctx) {
    ctx.unsubscribe();
  },
});

export function initBoundarySelector() {
  boundarySelectorControl.init();
}
