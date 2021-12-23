import { useContext } from 'react';
import { useAction, useAtom } from '@reatom/react';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { LogicalLayersRegistryContext } from '../LayersTree/LayersTree';
import { Folding } from '../Folding/Folding';
import {
  SimpleLegend,
  SimpleLegendStep,
} from '~core/logical_layers/createLogicalLayerAtom/types';

export function Layer({
  layerAtomId,
  mutuallyExclusive,
}: {
  layerAtomId: string;
  mutuallyExclusive: boolean;
}) {
  const registry = useContext(LogicalLayersRegistryContext);
  const [layerAtom, layerActions] = useAtom(registry[layerAtomId]);
  const onChange = useAction(
    () => (layerAtom.isMounted ? layerActions.unmount() : layerActions.mount()),
    [layerAtom.isMounted],
  );

  const hasOneStepSimpleLegend =
    layerAtom.layer.legend?.type === 'simple' &&
    layerAtom.layer.legend.steps?.length === 1;

  const hasMultiStepSimpleLegend =
    layerAtom.layer.legend?.type === 'simple' &&
    layerAtom.layer.legend.steps?.length > 1;

  const Control = (
    <LayerControl
      isError={layerAtom.isError}
      isLoading={layerAtom.isLoading}
      onChange={onChange}
      enabled={layerAtom.isMounted}
      hidden={!layerAtom.isVisible}
      name={layerAtom.layer.name || layerAtom.id}
      icon={
        hasOneStepSimpleLegend && (
          <SimpleLegendStepComponent
            step={layerAtom.layer.legend!.steps[0] as SimpleLegendStep}
            onlyIcon={true}
          />
        )
      }
      inputType={mutuallyExclusive ? 'radio' : 'checkbox'}
      controls={[
        <LayerInfo
          key={layerAtom.id}
          copyrights={layerAtom.layer.copyright}
          description={layerAtom.layer.description}
        />,
      ]}
    />
  );

  return hasMultiStepSimpleLegend ? (
    <Folding label={Control} open={layerAtom.isMounted}>
      <SimpleLegendComponent legend={layerAtom.layer.legend as SimpleLegend} />
    </Folding>
  ) : (
    Control
  );
}
