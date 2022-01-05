import { useAction, useAtom } from '@reatom/react';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { Folding } from '../Folding/Folding';
import {
  SimpleLegend,
  SimpleLegendStep,
} from '~core/logical_layers/createLogicalLayerAtom/types';
import type { LogicalLayerAtom } from '~core/types/layers';

export function Layer({
  layerAtom,
  mutuallyExclusive,
}: {
  layerAtom: LogicalLayerAtom;
  mutuallyExclusive: boolean;
}) {
  const [layerState, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () => (layerState.isMounted ? layerActions.unmount() : layerActions.mount()),
    [layerState.isMounted],
  );

  const hasOneStepSimpleLegend =
    layerState.layer.legend?.type === 'simple' &&
    layerState.layer.legend.steps?.length === 1;

  const hasMultiStepSimpleLegend =
    layerState.layer.legend?.type === 'simple' &&
    layerState.layer.legend.steps?.length > 1;

  const Control = (
    <LayerControl
      isError={layerState.isError}
      isLoading={layerState.isLoading}
      onChange={onChange}
      enabled={layerState.isMounted}
      hidden={!layerState.isVisible}
      name={layerState.layer.name || layerState.id}
      icon={
        hasOneStepSimpleLegend && (
          <SimpleLegendStepComponent
            step={layerState.layer.legend!.steps[0] as SimpleLegendStep}
            onlyIcon={true}
          />
        )
      }
      inputType={mutuallyExclusive ? 'radio' : 'checkbox'}
      controls={[
        <LayerInfo
          key={layerState.id}
          copyrights={layerState.layer.copyrights}
          description={layerState.layer.description}
        />,
      ]}
    />
  );

  return hasMultiStepSimpleLegend ? (
    <Folding label={Control} open={layerState.isMounted}>
      <SimpleLegendComponent legend={layerState.layer.legend as SimpleLegend} />
    </Folding>
  ) : (
    Control
  );
}
