import { AppFeature } from '~core/auth/types';
import { MapLayerPanel } from './components';
import type { FeatureInterface } from '~utils/metrics/lazyFeatureLoad';

export function MapLayersList({
  iconsContainerRef,
  reportReady,
}: {
  iconsContainerRef?: React.MutableRefObject<HTMLDivElement | null>;
  reportReady: () => void;
}) {
  if (!iconsContainerRef) return <></>;
  return (
    <MapLayerPanel
      iconsContainerRef={iconsContainerRef}
      reportReady={reportReady}
    />
  );
}

/* eslint-disable react/display-name */
export const featureInterface: FeatureInterface = {
  affectsMap: false,
  id: AppFeature.MAP_LAYERS_PANEL,
  rootComponentWrap:
    (reportReady: () => void, props: Record<string, unknown>) => () => {
      return <MapLayersList reportReady={reportReady} {...props} />;
    },
};
