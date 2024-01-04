import { useAtom } from '@reatom/react-v2';
import { useMemo } from 'react';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { LegendsList } from '../LegendsList/LegendsList';
import s from './PanelContent.module.css';

export function PanelContent() {
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
