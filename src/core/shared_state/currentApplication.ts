import { createAtom, createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';

export const currentApplicationAtom = createAtom(
  {
    init: (appid?: string) => appid,
  },
  ({ onAction }, state = '') => {
    onAction('init', async (appid) => {
      if (!appid) {
        const response = await apiClient.get<string>('/apps/default_id');
        state = response || '';
      } else {
        state = appid;
      }
    });

    return state;
  },
);
