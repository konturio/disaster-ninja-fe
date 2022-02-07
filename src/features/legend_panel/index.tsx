import { useAtom } from '@reatom/react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { currentMountedLayersAtom } from '~core/logical_layers/atoms/currentMountedLayers';
import { currentLegendsAtom } from '~core/logical_layers/atoms/currentLegends';

export function Legend({ iconsContainerId }: { iconsContainerId: string }) {
  const [layers] = useAtom(currentMountedLayersAtom);
  const [legends] = useAtom(currentLegendsAtom);

  return (
    <LegendPanel
      iconsContainerId={iconsContainerId}
      layers={Array.from(layers.values())}
      legends={legends}
    />
  );
}
