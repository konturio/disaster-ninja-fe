import { useAtom } from '@reatom/react';
import { useMemo } from 'react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import s from './components/LegendPanel/LegendPanel.module.css';
import { LegendsList } from './components/LegendPanel/LegendsList';

export function Legend() {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  return <LegendPanel layers={layersAtoms} />;
}

export function LegendPanelContent() {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  return (
    <div className={s.scrollable}>
      {layersAtoms.map((layer) => (
        <LegendsList layer={layer} key={layer.id} />
      ))}
    </div>
  );
}
