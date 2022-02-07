import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import {
  LayerLegend,
  SimpleLegendStep,
} from '~core/logical_layers/createLogicalLayerAtom/types';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import s from './LegendPanel.module.css';
import { useAtom } from '@reatom/react';
import type { LogicalLayerAtom } from '~core/types/layers';
import { BivariateLegend } from '~components/BivariateLegend/BivariateLegend';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';

export function LegendSorter({
  layer: layerAtom,
  legend,
}: {
  layer: LogicalLayerAtom;
  legend?: LayerLegend;
}) {
  const [{ layer, isMounted, isVisible }, layerActions] = useAtom(layerAtom);

  if (!legend || !layer.name) return null;

  const controlElements: JSX.Element[] = [];

  if (isMounted)
    controlElements.push(
      <LayerHideControl
        key={layer.id + 'hide'}
        isVisible={isVisible}
        hideLayer={layerActions.hide}
        unhideLayer={layerActions.unhide}
      />,
    );

  if (legend.type === 'bivariate') {
    return (
      <div className={s.legendContainer}>
        <BivariateLegend
          layer={layer}
          controls={controlElements}
          isHidden={!isVisible}
        />
      </div>
    );
  }

  if (legend.type === 'simple') {
    controlElements.push(<LayerInfo key={layer.id} layer={layer} />);
    const hasOneStepSimpleLegend = legend.steps.length === 1;
    return (
      <div className={s.legendContainer}>
        <LayerControl
          hidden={!isVisible}
          inputType="not-interactive"
          className={s.layerControl}
          enabled={true}
          name={layer.name}
          onChange={() => null}
          icon={
            hasOneStepSimpleLegend && (
              <SimpleLegendStepComponent
                step={legend!.steps[0] as SimpleLegendStep}
                onlyIcon={true}
              />
            )
          }
          controls={controlElements}
        />
        {!hasOneStepSimpleLegend && (
          <div className={s.legendBody}>
            <SimpleLegendComponent legend={legend} isHidden={!isVisible} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
