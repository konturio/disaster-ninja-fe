import { useLayerAtomFromRegistry } from '~utils/atoms';
import { NameWithSimpleLegend } from '~components/LegendPanel/components/NameWithLegend/NameWithSimpleLegend';
import s from './LegendPanel.module.css';
import { BivariateLegend } from '~components/LegendPanel/components/BivariateLegend/BivariateLegend';

export function LegendSorter({ id }: { id: string }) {
  const [{ layer }, atom] = useLayerAtomFromRegistry(id);

  if (!layer.legend || !layer.name) return null;

  if (layer.legend.type === 'bivariate')
    return (
      <div key={layer.id} className={s.legendContainer}>
        <BivariateLegend layer={layer} />
      </div>
    );
  return (
    <div className={s.legendContainer}>
      <NameWithSimpleLegend layer={layer} hasCheckBox={false} key={layer.id} />
    </div>
  );
}
