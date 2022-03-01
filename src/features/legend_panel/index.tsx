import { useAtom } from '@reatom/react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { useMemo } from 'react';

export function Legend({ iconsContainerId }: { iconsContainerId: string }) {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  return (
    <LegendPanel iconsContainerId={iconsContainerId} layers={layersAtoms} />
  );
}
