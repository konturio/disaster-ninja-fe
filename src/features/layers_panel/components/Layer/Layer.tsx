import { useAction, useAtom } from '@reatom/react';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { Folding } from '../Folding/Folding';
import type {
  LogicalLayer,
  SimpleLegend,
  SimpleLegendStep,
} from '~core/logical_layers/createLogicalLayerAtom/types';
import type { LogicalLayerAtom } from '~core/types/layers';
import { useEffect } from 'react';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';
import { DownloadControl } from '../DownloadControl/DownloadControl';

export function Layer({
  layerAtom,
  mutuallyExclusive,
  delegateLegendRender,
}: {
  layerAtom: LogicalLayerAtom;
  mutuallyExclusive: boolean;
  delegateLegendRender?: (params: {
    layer: LogicalLayer;
    isHidden: boolean;
  }) => void;
}) {
  const [layerState, layerActions] = useAtom(layerAtom);
  const onChange = useAction(
    () =>
      layerState.isMounted ? layerActions.disable() : layerActions.enable(),
    [layerState.isMounted],
  );

  useEffect(() => {
    if (!delegateLegendRender) return;
    if (layerState.isEnabled && layerState.layer.legend?.type === 'bivariate') {
      delegateLegendRender({
        layer: layerState.layer,
        isHidden: !layerState.isVisible,
      });
    }
  }, [delegateLegendRender, layerState]);

  const hasOneStepSimpleLegend =
    layerState.layer.legend?.type === 'simple' &&
    layerState.layer.legend.steps?.length === 1;

  const hasMultiStepSimpleLegend =
    layerState.layer.legend?.type === 'simple' &&
    layerState.layer.legend.steps?.length > 1;

  const controlElements: JSX.Element[] = [];
  if (layerState.isMounted)
    controlElements.push(
      <LayerHideControl
        key={layerState.id + 'hide'}
        isVisible={layerState.isVisible}
        hideLayer={layerActions.hide}
        unhideLayer={layerActions.unhide}
      />,
    );
  if (layerState.isMounted && layerState.layer.isDownloadable)
    controlElements.push(
      <DownloadControl
        key={layerState.id + 'download'}
        startDownload={layerActions.download}
      />,
    );
  controlElements.push(
    <LayerInfo key={layerState.id} layer={layerState.layer} />,
  );

  const Control = (
    <LayerControl
      isError={layerState.isError}
      isLoading={layerState.isLoading}
      onChange={onChange}
      enabled={layerState.isEnabled}
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
      controls={controlElements}
    />
  );

  return hasMultiStepSimpleLegend ? (
    <Folding label={Control} open={layerState.isMounted}>
      <SimpleLegendComponent
        legend={layerState.layer.legend as SimpleLegend}
        isHidden={!layerState.isVisible}
      />
    </Folding>
  ) : (
    Control
  );
}
