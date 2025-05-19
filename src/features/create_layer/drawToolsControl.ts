import { toolbar } from '~core/toolbar';
import { drawTools } from '~core/draw_tools';
import { CustomLayerDrawToolsWidget } from '~features/create_layer/CustomLayerDrawToolsWidget';

export const customLayerDrawToolsControl = toolbar.setupControl({
  id: 'customLayerDrawToolsControl',
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
