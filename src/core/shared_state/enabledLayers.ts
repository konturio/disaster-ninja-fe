import { createAtom } from '~utils/atoms';

export const enabledLayersAtom = createAtom(
  {
    set: (layersIds: Set<string> | string[]) => layersIds,
    add: (layerId: string) => layerId,
    remove: (layerId: string) => layerId,
  },
  ({ onAction }, state: Set<string> | null = null) => {
    onAction('set', (layersIds) => {
      state = Array.isArray(layersIds) ? new Set(layersIds) : layersIds;
    });

    onAction('add', (layerId) => {
      state = state ? new Set(state.add(layerId)) : new Set([layerId]);
    });

    onAction('remove', (layerId) => {
      if (state === null || !state.has(layerId)) {
        console.error(`Attempt to delete a non-existent layer: ${layerId}`);
        return;
      }
      const copy = new Set(state);
      copy.delete(layerId);
      state = copy;
    });
    return state;
  },
  '[Shared state] enabledLayersAtom',
);
