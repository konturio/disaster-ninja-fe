import { useAction, useAtom } from '@reatom/react-v2';
import { Layer as LayerComponent } from '~components/Layer';
import { useControlElements } from '~components/Layer/useControlElements';
import { LAYERS_PANEL_FEATURE_ID } from '../../constants';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';

export function Layer({
  layerAtom,
  mutuallyExclusive,
}: {
  layerAtom: LayerAtom;
  mutuallyExclusive: boolean;
}) {
  const [layerState, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () => (layerState.isMounted ? layerActions.disable() : layerActions.enable()),
    [layerState.isMounted],
  );

  const controlElements = useControlElements({
    layerState,
    layerActions,
    skipControls: {
      skipVisibilityControl: true,
    },
    tooltipLayerId: LAYERS_PANEL_FEATURE_ID,
  });
  return (
    <LayerComponent
      controlElements={controlElements}
      layerState={layerState}
      mutuallyExclusive={mutuallyExclusive}
      onChange={onChange}
      canFold={false}
    />
  );
}
