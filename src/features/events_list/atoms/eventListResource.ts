import { createResourceAtom } from '~utils/atoms';
import { apiClient } from '~core/index';
import { autoRefreshService } from '~core/auto_refresh';
import { Event } from '~core/types';

export const eventListResourceAtom = createResourceAtom(
  null,
  async () => {
    const responseData = await apiClient.get<Event[]>(
      `/events/`,
      undefined,
      false,
    );
    if (responseData === undefined) throw new Error('No data received');
    return responseData;
  },
  'eventListResource',
);

autoRefreshService.addWatcher('eventList', eventListResourceAtom);
