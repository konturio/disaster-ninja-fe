import { createBindAtom } from '~utils/atoms/createBindAtom';

/* Mounted layers */
// ! Read only !
export const mountedLogicalLayersAtom = createBindAtom(
  {
    add: (layerId: string) => layerId,
    remove: (layerId: string) => layerId,
  },
  ({ onAction }, state: string[] = []) => {
    onAction('add', (layerId) => {
      state = [...state, layerId];
    });

    onAction('remove', (layerId) => {
      state = state.filter((l) => l !== layerId);
    });
    return state;
  },
  '[Shared state] mountedLogicalLayersAtom',
);
