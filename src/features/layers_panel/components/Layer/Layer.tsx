import { useAction, useAtom } from '@reatom/react';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { Folding } from '../Folding/Folding';
import type {
  LayerLegend,
  SimpleLegend,
  SimpleLegendStep,
} from '~core/logical_layers/types/legends';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';
import { useEffect, useState } from 'react';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';
import { DownloadControl } from '../DownloadControl/DownloadControl';
import type { LayerMeta } from '~core/logical_layers/types/meta';
import { UserLayerContext } from '~features/layers_panel/components/UserLayerContext/UserLayerContext';

export function Layer({
  layerAtom,
  mutuallyExclusive,
  delegateLegendRender,
}: {
  layerAtom: LayerAtom;
  mutuallyExclusive: boolean;
  delegateLegendRender?: (params: {
    meta: LayerMeta | null;
    legend: LayerLegend | null;
    name: string;
    isHidden: boolean;
  }) => void;
}) {
  const [layerState, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () =>
      layerState.isMounted ? layerActions.disable() : layerActions.enable(),
    [layerState.isMounted],
  );
  const [controlElements, setControlElements] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!delegateLegendRender) return;
    if (layerState.isEnabled && layerState.legend?.type === 'bivariate') {
      delegateLegendRender({
        legend: layerState.legend,
        meta: layerState.meta,
        name: layerState.settings?.name ?? '',
        isHidden: !layerState.isVisible,
      });
    }
  }, [delegateLegendRender, layerState]);

  useEffect(() => {
    const elements: JSX.Element[] = [];
    if (layerState.isMounted)
      elements.push(
        <LayerHideControl
          key={layerState.id + 'hide'}
          isVisible={layerState.isVisible}
          hideLayer={layerActions.hide}
          unhideLayer={layerActions.show}
        />,
      );
    if (layerState.isMounted && layerState.isDownloadable)
      elements.push(
        <DownloadControl
          key={layerState.id + 'download'}
          startDownload={layerActions.download}
        />,
      );

    if (layerState?.settings?.group === 'user_layers')
      elements.push(
        <UserLayerContext
          layerId={layerState.id}
          key={layerState.id + 'context'}
        />,
      );

    if (layerState.meta) {
      elements.push(<LayerInfo key={layerState.id} meta={layerState.meta} />);
    }

    setControlElements(elements);
  }, [layerState, layerActions]);

  const hasOneStepSimpleLegend =
    layerState.legend?.type === 'simple' &&
    layerState.legend.steps?.length === 1;

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
