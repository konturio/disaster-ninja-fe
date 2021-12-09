import { useAtom } from '@reatom/react';
import { logicalLayersRegistryStateAtom } from '~core/logical_layers/atoms/logicalLayersRegistryState';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { createBindAtom } from '~utils/atoms';

const mountedLogicalLayersAtom = createBindAtom(
  {
    layersStates: logicalLayersRegistryStateAtom,
  },
  ({ get }) => {
    return Object.values(get('layersStates')).reduce(
      (acc, l) => (l.isMounted && acc.push(l.id), acc),
      [] as string[],
    );
  },
);

export function Legend() {
  const [layersId] = useAtom(mountedLogicalLayersAtom);

  return <LegendPanel layersId={layersId} />;
}
