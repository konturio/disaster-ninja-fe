import { useAtom } from '@reatom/react';
import { logicalLayersRegistryAtom } from '~core/shared_state/logicalLayersRegistry';

export function useLayerAtomFromRegistry(layerId: string) {
  const [registry] = useAtom(logicalLayersRegistryAtom);
  return useAtom(registry[layerId]);
}
