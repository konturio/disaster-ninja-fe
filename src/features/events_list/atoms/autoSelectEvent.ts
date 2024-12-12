import { atom } from '@reatom/framework';
import { currentNotificationAtom } from '~core/shared_state';
import {
  currentEventAtom,
  scheduledAutoFocus,
  scheduledAutoSelect,
} from '~core/shared_state/currentEvent';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { sortedEventListAtom } from './sortedEventList';

export const autoSelectEventV3 = atom((ctx) => {
  const eventListResource = ctx.spy(sortedEventListAtom);
  const autoSelectWasScheduled = ctx.get(scheduledAutoSelect.v3atom);
  if (
    autoSelectWasScheduled &&
    eventListResource &&
    !eventListResource.loading &&
    !eventListResource.error &&
    eventListResource.data &&
    eventListResource.data.length
  ) {
    const currentEvent = ctx.get(currentEventAtom.v3atom);
    const currentEventNotInTheList = !eventListResource.data.some(
      (e) => e.eventId === currentEvent?.id,
    );

    if (!currentEventNotInTheList) return;

    if (currentEvent?.id) {
      // This case happens when call for event by provided eventId didn't return event
      currentNotificationAtom.showNotification.dispatch(
        'warning',
        { title: i18n.t('event_list.no_event_in_feed') },
        5,
      );
    } else {
      const firstEventInList = eventListResource.data[0];
      store.dispatch([
        scheduledAutoSelect.setFalse(),
        scheduledAutoFocus.setTrue(),
        currentEventAtom.setCurrentEventId(firstEventInList.eventId),
      ]);
    }
  }
}, 'autoSelectEvent');
