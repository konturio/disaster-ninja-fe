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
  const [layer, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () => (layer.isMounted ? layerActions.unmount() : layerActions.mount()),
    [layer.isMounted],
  );

  const hasOneStepSimpleLegend =
    layer.layer.legend?.type === 'simple' &&
    layer.layer.legend.steps?.length === 1;

  const hasMultiStepSimpleLegend =
    layer.layer.legend?.type === 'simple' &&
    layer.layer.legend.steps?.length > 1;

  const Control = (
    <LayerControl
      isError={layer.isError}
      isLoading={layer.isLoading}
      onChange={onChange}
      enabled={layer.isMounted}
      hidden={!layer.isVisible}
      name={layer.layer.name || layer.id}
      icon={
        hasOneStepSimpleLegend && (
          <SimpleLegendStepComponent
            step={layer.layer.legend!.steps[0] as SimpleLegendStep}
            onlyIcon={true}
          />
        )
      }
      inputType={mutuallyExclusive ? 'radio' : 'checkbox'}
      controls={[
        <LayerInfo
          key={layer.id}
          copyrights={layer.layer.copyright}
          description={layer.layer.description}
        />,
      ]}
    />
  );

  return hasMultiStepSimpleLegend ? (
    <Folding label={Control} open={layer.isMounted}>
      <SimpleLegendComponent legend={layer.layer.legend as SimpleLegend} />
    </Folding>
  ) : (
    Control
  );
}
