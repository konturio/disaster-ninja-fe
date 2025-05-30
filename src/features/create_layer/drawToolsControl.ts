import { toolbar } from '~core/toolbar';
import { drawTools } from '~core/draw_tools';
import { CustomLayerDrawToolsWidget } from '~features/create_layer/CustomLayerDrawToolsWidget';
import { CUSTOM_LAYER_DRAW_TOOLS_CONTROL } from '~features/create_layer/constants';

export const customLayerDrawToolsControl = toolbar.setupControl({
  id: CUSTOM_LAYER_DRAW_TOOLS_CONTROL,
  borrowMapInteractions: true,
  type: 'widget',
  typeSettings: {
    component: CustomLayerDrawToolsWidget,
  },
});

customLayerDrawToolsControl.onStateChange(async (ctx, state, prevState) => {
  if (state === 'active') {
  } else if (prevState === 'active') {
    drawTools.exit();
  }
});
