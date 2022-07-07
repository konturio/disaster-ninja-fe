import { useAtom } from '@reatom/react';
import { useMemo } from 'react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { featureStatus } from '~core/featureStatus';
import { AppFeature } from '~core/auth/types';

let markedReady = false;

export function Legend({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  if (!markedReady) {
    featureStatus.markReady(AppFeature.LEGEND_PANEL);
    markedReady = true;
  }
  return (
    <LegendPanel iconsContainerRef={iconsContainerRef} layers={layersAtoms} />
  );
}
