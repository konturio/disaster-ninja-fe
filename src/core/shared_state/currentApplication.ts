import { createAtom } from '~utils/atoms';
import { apiClient } from '~core/apiClientInstance';

export const currentApplicationAtom = createAtom(
  {
    init: (appid?: string) => appid,
    _update: (val: string) => val,
  },
  ({ onAction, schedule, create }, state = '') => {
    onAction('init', (appid) => {
      if (!appid) {
        schedule(async (dispatch) => {
          const response = await apiClient.get<string>('/apps/default_id');
          if (response) {
            dispatch(create('_update', response));
          }
        });
      } else {
        state = appid;
      }
    });

    onAction('_update', (val) => {
      state = val;
    });

    return state;
  },
);
