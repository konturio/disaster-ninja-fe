import { useAtom } from '@reatom/react';
import { useMemo } from 'react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';

export function Legend() {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  return <LegendPanel layers={layersAtoms} />;
}
