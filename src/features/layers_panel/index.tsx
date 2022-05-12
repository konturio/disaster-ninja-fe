import { MapLayerPanel } from './components';

export function MapLayersList({
  iconsContainerRef,
}: {
  iconsContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}) {
  return <MapLayerPanel iconsContainerRef={iconsContainerRef} />;
}
