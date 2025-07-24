import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
  MAP_RULER_LAYER_ID,
} from '~features/map_ruler/constants';
import { createLogicalLayerAtom } from '~core/logical_layers/utils/logicalLayerFabric';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { MapRulerRenderer } from './renderers/MapRulerRenderer';
import type { Action } from '@reatom/core-v2';

export const mapRulerControl = toolbar.setupControl<{
  logicalLayerAtom: {
    enable: () => Action;
    disable: () => Action;
  };
}>({
  id: MAP_RULER_CONTROL_ID,
  borrowMapInteractions: true,
  type: 'button',
  typeSettings: {
    name: MAP_RULER_CONTROL_NAME,
    hint: MAP_RULER_CONTROL_NAME,
    icon: 'Ruler24',
    preferredSize: 'tiny',
  },
});

mapRulerControl.onInit((ctx) => {
  const renderer = new MapRulerRenderer(MAP_RULER_LAYER_ID);
  const logicalLayerAtom = createLogicalLayerAtom(
    MAP_RULER_LAYER_ID,
    renderer,
    layersRegistryAtom,
  );
  ctx.logicalLayerAtom = logicalLayerAtom;
});

mapRulerControl.onStateChange((ctx, state, prevState) => {
  if (ctx.logicalLayerAtom) {
    if (state === 'active') {
      store.dispatch(ctx.logicalLayerAtom.enable());
    } else if (prevState === 'active') {
      store.dispatch(ctx.logicalLayerAtom.disable());
    }
  }
});

export function initMapRuler() {
  mapRulerControl.init();
}
