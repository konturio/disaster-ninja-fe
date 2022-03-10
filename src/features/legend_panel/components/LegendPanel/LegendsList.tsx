import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import type { SimpleLegendStep } from '~core/logical_layers/types/legends';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import s from './LegendPanel.module.css';
import { useAtom } from '@reatom/react';
import type { LayerAtom } from '~core/logical_layers/types/logicalLayer';
import { BivariateLegend } from '~components/BivariateLegend/BivariateLegend';
import { LayerHideControl } from '~components/LayerHideControl/LayerHideControl';

export function LegendsList({ layer: layerAtom }: { layer: LayerAtom }) {
  const [{ id, settings, isMounted, isVisible, meta, legend }, layerActions] =
    useAtom(layerAtom);

  if (!legend || !settings?.name) return null;

  const controlElements: JSX.Element[] = [];

  if (isMounted)
    controlElements.push(
      <LayerHideControl
        key={id + 'hide'}
        isVisible={isVisible}
        hideLayer={layerActions.hide}
        unhideLayer={layerActions.show}
      />,
    );

  if (legend.type === 'bivariate') {
    return (
      <div className={s.legendContainer}>
        <BivariateLegend
          name={settings.name}
          meta={meta}
          legend={legend}
          controls={controlElements}
          isHidden={!isVisible}
        />
      </div>
    );
  }

  if (legend.type === 'simple') {
    meta && controlElements.push(<LayerInfo key={id} meta={meta} />);
    const hasOneStepSimpleLegend = legend.steps.length === 1;
    return (
      <div className={s.legendContainer}>
        <LayerControl
          hidden={!isVisible}
          inputType="not-interactive"
          className={s.layerControl}
          enabled={true}
          name={settings.name}
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
