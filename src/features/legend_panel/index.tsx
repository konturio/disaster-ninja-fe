import { useAtom } from '@reatom/react';
import { mountedLogicalLayersAtom } from '~core/shared_state';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';

export function Legend() {
  const [layersId] = useAtom(mountedLogicalLayersAtom);

  return <LegendPanel layersId={layersId} />;
}
