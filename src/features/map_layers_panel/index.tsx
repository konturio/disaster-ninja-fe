import { useAtom } from '@reatom/react';
import { logicalLayersRegistryAtom } from '~core/shared_state';
import { MapLayerPanel } from './components';

export function MapLayersList() {
  const [layersRegistry] = useAtom(logicalLayersRegistryAtom);
  const logicalLayersAtoms = Object.values(layersRegistry);
  return <MapLayerPanel layersAtoms={logicalLayersAtoms} />;
}
