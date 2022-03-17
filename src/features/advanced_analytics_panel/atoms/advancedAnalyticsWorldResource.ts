import { createAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { AdvancedAnalyticsData } from '~core/types';

interface ResourceState {
  loading: boolean;
  error: null | unknown;
  data: any;
}

const initialState = { loading: false, error: null, data: null };

export const worldAnalyticsResource = createAtom(
  {
    getWorld: () => null,
    _setState: (state: ResourceState) => state,
  },
  ({ onAction, schedule, create }, state: ResourceState = initialState) => {
    onAction('getWorld', () => {
      // 2. When action was dispatched we set loading to "true".
      // This is *first* state update, App show "Loading..."
      state = { ...state, loading: true, error: null };
      // 3. Planning next update.
      schedule(async (dispatch) => {
        try {
          // 4. Call api
          const response = await apiClient.post<AdvancedAnalyticsData[] | null>(
            `/advanced_polygon_details/`,
            null,
            false,
          );
          // 5. Now we have response - emit action for next state upate
          dispatch(
            create('_setState', {
              loading: false,
              error: null,
              data: response,
            }),
          );
        } catch (e) {
          dispatch(
            create('_setState', { loading: false, error: e, data: null }),
          );
        }
      });
    });

    onAction('_setState', (newState) => {
      // 6. Update state
      // This is *second* state update that already contain data
      state = newState;
    });

    return state;
  },
);
