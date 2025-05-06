import { useAtom as useAtomV2 } from '@reatom/react-v2';
import { useAtom as useAtomV3 } from '@reatom/npm-react';
import { LEGEND_PANEL_FEATURE_ID } from '~features/legend_panel/constants';
import { useControlElements } from '~components/Layer/useControlElements';
import { Layer as LayerComponent } from '~components/Layer';
import { presentationModeAtom } from '~core/shared_state/presentationMode';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

export function LegendsList({ layer: layerAtom }: { layer: LayerAtom }) {
  const [layerState, layerActions] = useAtomV2(layerAtom);
  const [isPresentationMode] = useAtomV3(presentationModeAtom);

  const controlElements = useControlElements({
    layerState,
    layerActions,
    tooltipLayerId: LEGEND_PANEL_FEATURE_ID,
  });

  if (!layerState.legend || !layerState.settings?.name) return null;

  return (
    <LayerComponent
      canFold={false}
      controlElements={!isPresentationMode ? controlElements : undefined}
      layerState={layerState}
    />
  );
}
