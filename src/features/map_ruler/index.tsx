import { Ruler24 } from '@konturio/default-icons';
import { toolbarControlsAtom } from '~core/shared_state';
import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
  MAP_RULER_LAYER_ID,
} from '~features/map_ruler/constants';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import core from '~core/index';
import { createLogicalLayerAtom } from '~core/logical_layers/utils/logicalLayerFabric';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { MapRulerRenderer } from './renderers/MapRulerRenderer';

export function initMapRuler() {
  const renderer = new MapRulerRenderer(MAP_RULER_LAYER_ID);
  const logicalLayerAtom = createLogicalLayerAtom(
    MAP_RULER_LAYER_ID,
    renderer,
    layersRegistryAtom,
  );

  toolbarControlsAtom.addControl.dispatch({
    id: MAP_RULER_CONTROL_ID,
    name: MAP_RULER_CONTROL_NAME,
    title: core.i18n.t('sidebar.ruler'),
    active: false,
    exclusiveGroup: controlGroup.mapTools,
    visualGroup: controlVisualGroup.noAnalytics,
    icon: <Ruler24 />,
    onClick: (becomesActive) => {
      toolbarControlsAtom.toggleActiveState.dispatch(MAP_RULER_CONTROL_ID);
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
