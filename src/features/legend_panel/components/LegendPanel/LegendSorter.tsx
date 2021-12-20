import { useMemo } from 'react';
import { useLayerAtomFromRegistry } from '~core/logical_layers/useLayerAtomFromRegistry';
import { NameWithSimpleLegend } from '~components/LegendPanel/components/NameWithSimpleLegend/NameWithSimpleLegend';
import s from './LegendPanel.module.css';
import { BivariateLegend } from '~components/LegendPanel/components/BivariateLegend/BivariateLegend';
import { Tooltip } from '~components/Tooltip/Tooltip';

export function LegendSorter({ id }: { id: string }) {
  const [{ layer }] = useLayerAtomFromRegistry(id);

  const tipText = useMemo(() => {
    if (!layer.legend || layer.legend.type === 'bivariate') return '';
    let message = '';
    if (layer.description) message = layer.description;

    if (layer.copyright) message += '\n' + layer.copyright;

    return message;
  }, [layer.legend]);

  if (!layer.legend || !layer.name) return null;

  if (layer.legend.type === 'bivariate')
    return (
      <div className={s.legendContainer} >
        <BivariateLegend layer={layer} />
      </div>
    );
  return (
    <div className={s.legendContainer}>
      <NameWithSimpleLegend controlIcons={[
        <Tooltip className={s.tooltip} tipText={tipText} />]} legend={layer.legend} layerName={layer.name} />
    </div>
  );
}
