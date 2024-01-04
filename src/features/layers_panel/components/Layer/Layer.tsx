import { useEffect } from 'react';
import { useAction, useAtom } from '@reatom/react-v2';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { Folding } from '../Folding/Folding';
import { useControlElements } from './useControlElements';
import type {
  LayerLegend,
  SimpleLegend,
  SimpleLegendStep,
} from '~core/logical_layers/types/legends';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';
import type { LayerMeta } from '~core/logical_layers/types/meta';

export function Layer({
  layerAtom,
  mutuallyExclusive,
  delegateLegendRender,
}: {
  layerAtom: LayerAtom;
  mutuallyExclusive: boolean;
  delegateLegendRender?: (
    params: {
      meta: LayerMeta | null;
      legend: LayerLegend | null;
      name: string;
      isHidden: boolean;
    } | null,
  ) => void;
}) {
  const [layerState, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () => (layerState.isMounted ? layerActions.disable() : layerActions.enable()),
    [layerState.isMounted],
  );

  const controlElements = useControlElements(layerState, layerActions, {
    skipVisibilityControl: true,
  });
  useEffect(() => {
    if (!delegateLegendRender) return;
    if (layerState.isEnabled) {
      if (layerState.legend?.type === 'bivariate') {
        delegateLegendRender({
          legend: layerState.legend,
          meta: layerState.meta,
          name: layerState.settings?.name ?? '',
          isHidden: !layerState.isVisible,
        });
      }
    }
    return () => {
      delegateLegendRender(null);
    };
  }, [delegateLegendRender, layerState]);

  const hasOneStepSimpleLegend =
    layerState.legend?.type === 'simple' && layerState.legend.steps?.length === 1;

  const hasMultiStepSimpleLegend =
    layerState.legend?.type === 'simple' && layerState.legend.steps?.length > 1;

  const Control = (
    <LayerControl
      isError={layerState.error !== null}
      isLoading={layerState.isLoading}
      onChange={onChange}
      enabled={layerState.isEnabled}
      hidden={!layerState.isVisible}
      name={layerState.settings?.name || layerState.id}
      icon={
        hasOneStepSimpleLegend && (
          <SimpleLegendStepComponent
            step={layerState.legend!.steps[0] as SimpleLegendStep}
            onlyIcon={true}
          />
        )
      }
      inputType={mutuallyExclusive ? 'radio' : 'checkbox'}
      controls={controlElements}
    />
  );

  return hasMultiStepSimpleLegend ? (
    <Folding title={Control} open={layerState.isMounted}>
      <SimpleLegendComponent
        legend={layerState.legend as SimpleLegend}
        isHidden={!layerState.isVisible}
      />
    </Folding>
  ) : (
    Control
  );
}
