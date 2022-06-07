import { sideControlsBarAtom } from '~core/shared_state';
import { Ruler24 } from '@konturio/default-icons';
import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
  MAP_RULER_LAYER_ID,
} from '~features/map_ruler/constants';
import {
  controlGroup,
  controlVisualGroup,
} from '~core/shared_state/sideControlsBar';
import { i18n } from '~core/localization';
import { createLogicalLayerAtom } from '~core/logical_layers/utils/logicalLayerFabric';
import { MapRulerRenderer } from './renderers/MapRulerRenderer';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';

export function initMapRuler() {
  const renderer = new MapRulerRenderer(MAP_RULER_LAYER_ID);
  const logicalLayerAtom = createLogicalLayerAtom(
    MAP_RULER_LAYER_ID,
    renderer,
    layersRegistryAtom,
  );

  sideControlsBarAtom.addControl.dispatch({
    id: MAP_RULER_CONTROL_ID,
    name: MAP_RULER_CONTROL_NAME,
    title: i18n.t('Ruler'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <Ruler24 />,
    onClick: (becomesActive) => {
      sideControlsBarAtom.toggleActiveState.dispatch(MAP_RULER_CONTROL_ID);
    },
    onChange: (becomesActive) => {
      if (becomesActive) {
        logicalLayerAtom.enable.dispatch();
      } else {
        logicalLayerAtom.disable.dispatch();
      }
    },
  });
}
