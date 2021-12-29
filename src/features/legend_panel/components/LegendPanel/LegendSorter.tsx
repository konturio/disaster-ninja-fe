import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { SimpleLegendStep } from '~core/logical_layers/createLogicalLayerAtom/types';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { BivariateLegend } from '~components/LegendPanel/components/BivariateLegend/BivariateLegend';
import s from './LegendPanel.module.css';
import { useAtom } from '@reatom/react';
import type { LogicalLayerAtom } from '~core/types/layers';

export function LegendSorter({
  layer: layerAtom,
}: {
  layer: LogicalLayerAtom;
}) {
  const [{ layer }] = useAtom(layerAtom);

  if (!layer.legend || !layer.name) return null;

  if (layer.legend.type === 'bivariate') {
    return (
      <div className={s.legendContainer}>
        <BivariateLegend layer={layer} />
      </div>
    );
  }

  if (layer.legend.type === 'simple') {
    const hasOneStepSimpleLegend = layer.legend.steps.length === 1;

    return (
      <div className={s.legendContainer}>
        <LayerControl
          hidden={false}
          inputType="not-interactive"
          className={s.layerControl}
          enabled={true}
          name={layer.name}
          onChange={() => null}
          icon={
            hasOneStepSimpleLegend && (
              <SimpleLegendStepComponent
                step={layer.legend!.steps[0] as SimpleLegendStep}
                onlyIcon={true}
              />
            )
          }
          controls={[
            <LayerInfo
              key={layer.id}
              copyrights={layer.copyright}
              description={layer.description}
            />,
          ]}
        />
        {!hasOneStepSimpleLegend && (
          <div className={s.legendBody}>
            <SimpleLegendComponent legend={layer.legend} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
