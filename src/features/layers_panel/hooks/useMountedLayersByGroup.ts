import { useAtom } from '@reatom/react-v2';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';

export function useMountedLayersByGroup(groupId: string): number {
  const [enabledLayers] = useAtom(enabledLayersAtom);
  const [layersSettings] = useAtom(layersSettingsAtom);

  return Array.from(enabledLayers).reduce((acc, id) => {
    const settings = layersSettings.get(id);
    if (settings?.data?.group === groupId) {
      return acc + 1;
    }
    return acc;
  }, 0);
}
