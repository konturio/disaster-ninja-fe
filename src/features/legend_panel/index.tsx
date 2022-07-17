import { useAtom } from '@reatom/react';
import { useEffect, useMemo } from 'react';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';
import { mountedLayersAtom } from '~core/logical_layers/atoms/mountedLayers';
import { AppFeature } from '~core/auth/types';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

function Legend({
  reportReady,
  iconsContainerRef,
}: {
  iconsContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  reportReady: () => void;
}) {
  const [layers] = useAtom(mountedLayersAtom);
  const layersAtoms = useMemo(() => Array.from(layers.values()), [layers]);

  useEffect(() => reportReady(), [reportReady]);

  if (!iconsContainerRef) return <></>;
  return (
    <LegendPanel iconsContainerRef={iconsContainerRef} layers={layersAtoms} />
  );
}

/* eslint-disable react/display-name */
/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.LEGEND_PANEL,
  rootComponentWrap:
    (reportReady: () => void, props: Record<string, unknown>) => () => {
      return <Legend reportReady={reportReady} {...props} />;
    },
};
