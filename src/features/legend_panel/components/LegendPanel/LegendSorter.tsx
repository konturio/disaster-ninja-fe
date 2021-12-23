import { useMemo } from 'react';
import { useLayerAtomFromRegistry } from '~core/logical_layers/useLayerAtomFromRegistry';
import {
  SimpleLegend as SimpleLegendComponent,
  SimpleLegendStep as SimpleLegendStepComponent,
} from '~components/SimpleLegend/SimpleLegend';
import { SimpleLegendStep } from '~core/logical_layers/createLogicalLayerAtom/types';
import { LayerControl } from '~components/LayerControl/LayerControl';
import { LayerInfo } from '~components/LayerInfo/LayerInfo';
import { BivariateLegend } from '~components/LegendPanel/components/BivariateLegend/BivariateLegend';
import s from './LegendPanel.module.css';

export function LegendSorter({ id }: { id: string }) {
  const [{ layer }] = useLayerAtomFromRegistry(id);

  const tipText = useMemo(() => {
    if (!layer.legend || layer.legend.type === 'bivariate') return '';
    let message = '';
    if (layer.description) message += layer.description;
    if (layer.copyright) message += '\n' + layer.copyright;
    return message;
  }, [layer.legend, layer.description, layer.copyright]);

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
