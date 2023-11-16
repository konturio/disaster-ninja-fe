import {
  MAP_RULER_CONTROL_ID,
  MAP_RULER_CONTROL_NAME,
  MAP_RULER_LAYER_ID,
} from '~features/map_ruler/constants';
import { i18n } from '~core/localization';
import { createLogicalLayerAtom } from '~core/logical_layers/utils/logicalLayerFabric';
import { layersRegistryAtom } from '~core/logical_layers/atoms/layersRegistry';
import { toolbar } from '~core/toolbar';
import { store } from '~core/store/store';
import { MapRulerRenderer } from './renderers/MapRulerRenderer';
import type { Action } from '@reatom/core';

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
    hint: i18n.t('sidebar.ruler'),
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

mapRulerControl.onStateChange((ctx, state) => {
  if (state === 'active') {
    store.dispatch(ctx.logicalLayerAtom?.enable());
  } else {
    store.dispatch(ctx.logicalLayerAtom?.disable());
  }
});

export function initMapRuler() {
  mapRulerControl.init();
}
