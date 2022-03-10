import { createAtom } from '~utils/atoms';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';
import { enabledLayersAtom } from '~core/logical_layers/atoms/enabledLayers';

export const categoryDeselection = createAtom(
  {
    deselect: (categoryId: string) => categoryId,
  },
  ({ getUnlistedState, onAction, schedule }, state = {}) => {
    onAction('deselect', (categoryId) => {
      const enabledLayers = getUnlistedState(enabledLayersAtom);
      const layersSettings = getUnlistedState(layersSettingsAtom);
      const enabledLayersInGroup = Array.from(enabledLayers).reduce(
        (acc, id) => {
          const settings = layersSettings.get(id);
          if (settings?.data?.category === categoryId) {
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
