import { useAtom } from '@reatom/react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLogicalLayersAtom } from './atoms/mountedLogicalLayers';

export function Legend({ iconsContainerId }: { iconsContainerId: string }) {
  const [layersId] = useAtom(mountedLogicalLayersAtom);
  return (
    <LegendPanel iconsContainerId={iconsContainerId} layersId={layersId} />
  );
}
