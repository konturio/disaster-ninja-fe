import { AppFeature } from '~core/auth/types';
import { MapLayerPanel } from './components';

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

export const featureInterface = {
  affectsMap: false,
  id: AppFeature.MAP_LAYERS_PANEL,
  RootComponent: MapLayersList,
};
