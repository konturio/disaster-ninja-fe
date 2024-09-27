import { atom } from '@reatom/core';
import { currentNotificationAtom } from '~core/shared_state';
import { currentEventAtom, scheduledAutoSelect } from '~core/shared_state/currentEvent';
import { i18n } from '~core/localization';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { eventListResourceAtom } from './eventListResource';

// reatom v2 imports mapped to reatom v3
const __v3_imports = {
  eventListResourceAtom: eventListResourceAtom.v3atom,
  scheduledAutoSelect: scheduledAutoSelect.v3atom,
  currentEventAtom: currentEventAtom.v3atom,
};
function __create_v3() {
  const { eventListResourceAtom, scheduledAutoSelect, currentEventAtom } = __v3_imports;
  // v3 definitions section
  const autoSelectEvent = atom((ctx) => {
    const eventListResource = ctx.spy(eventListResourceAtom);
    const autoSelectWasScheduled = ctx.spy(scheduledAutoSelect);
    const currentEvent = ctx.spy(currentEventAtom);

    if (
      !autoSelectWasScheduled ||
      !eventListResource?.data?.length ||
      eventListResource.loading ||
      eventListResource.error
    ) {
      return;
    }

    const currentEventNotInTheList = !eventListResource.data.some(
      (e) => e.eventId === currentEvent?.id,
    );

    if (currentEventNotInTheList && currentEvent?.id) {
      currentNotificationAtom.showNotification.v3action(
        ctx,
        'warning',
        { title: i18n.t('event_list.no_event_in_feed') },
        5,
      );
      currentEventAtom(ctx, { id: null });
    }

    scheduledAutoSelect(ctx, false);
  }, 'autoSelectEvent');

  // v3 exports object
  return {
    autoSelectEvent,
  };
}
const v3 = __create_v3();
// v3 exports as default
export default v3;

// v2 compatible exports keeping the same names
export const autoSelectEvent = v3toV2(v3.autoSelectEvent);
