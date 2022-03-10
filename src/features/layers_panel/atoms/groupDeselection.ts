import { createAtom } from '~utils/atoms';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const groupDeselection = createAtom(
  {
    deselect: (groupId: string) => groupId,
  },
  ({ getUnlistedState, onAction, schedule }, state = {}) => {
    onAction('deselect', (groupId) => {
      const enabledLayers = getUnlistedState(enabledLayersAtom);
      const layersSettings = getUnlistedState(layersSettingsAtom);
      const enabledLayersInGroup = Array.from(enabledLayers).reduce(
        (acc, id) => {
          const settings = layersSettings.get(id);
          if (settings?.data?.group === groupId) {
            acc.push(id);
          }
          return acc;
        },
        [] as string[],
      );
      if (enabledLayersInGroup.length === 0) return;

      const disableActions = enabledLayersInGroup.map((layerId) =>
        enabledLayersAtom.delete(layerId),
      );
      schedule((dispatch) => dispatch(disableActions));
    });
  },
);
