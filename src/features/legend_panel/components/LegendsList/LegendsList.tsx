import { useAtom } from '@reatom/react-v2';
import { LEGEND_PANEL_FEATURE_ID } from '~features/legend_panel/constants';
import { useControlElements } from '~components/Layer/useControlElements';
import { Layer as LayerComponent } from '~components/Layer';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

export function LegendsList({ layer: layerAtom }: { layer: LayerAtom }) {
  const [layerState, layerActions] = useAtom(layerAtom);

  const controlElements = useControlElements({
    layerState,
    layerActions,
    tooltipLayerId: LEGEND_PANEL_FEATURE_ID,
  });

  if (!layerState.legend || !layerState.settings?.name) return null;

  return (
    <LayerComponent
      canFold={false}
      controlElements={controlElements}
      layerState={layerState}
    />
  );
}
