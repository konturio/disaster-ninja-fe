import { useAtom } from '@reatom/react';
import { logicalLayersRegistryAtom } from '~core/logical_layers/atoms/logicalLayersRegistry';

export function useLayerAtomFromRegistry(layerId: string) {
  const [registry] = useAtom(logicalLayersRegistryAtom);
  return useAtom(registry[layerId]);
}
