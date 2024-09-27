import { atom, action, type Ctx } from '@reatom/core';
import { v3toV2 } from '~utils/atoms/v3tov2';
import { configRepo } from '~core/config';
import { currentEventAtom, scheduledAutoSelect } from './currentEvent';
import type { EventFeedConfig } from '~core/config/types';

// reatom v2 imports mapped to reatom v3
const __v3_imports = {
  currentEventAtom: currentEventAtom.v3atom,
  scheduledAutoSelect: scheduledAutoSelect.v3atom,
};

function __create_v3() {
  const { currentEventAtom, scheduledAutoSelect } = __v3_imports;
  // v3 definitions section

  type CurrentEventFeedAtomState = {
    id: string;
  } | null;

  const currentEventFeedAtom = atom<CurrentEventFeedAtomState>(
    { id: configRepo.get().defaultFeed },
    'currentEventFeedAtom',
  );

  const setCurrentFeed = action((ctx, feedId: string) => {
    updateFeed(ctx, feedId);
  }, 'setCurrentFeed');

  const setFeedForExistingEvent = action((ctx, feedId: string) => {
    updateFeed(ctx, feedId);
  }, 'setFeedForExistingEvent');

  const resetCurrentFeed = action((ctx) => {
    updateFeed(ctx, null);
  }, 'resetCurrentFeed');

  const syncFeed = action(
    (ctx, eventFeeds: { data: EventFeedConfig[]; loading: boolean }) => {
      if (eventFeeds?.data?.length && !eventFeeds.loading) {
        const currentFeed = ctx.get(currentEventFeedAtom);
        const newFeed = checkFeed(eventFeeds.data, currentFeed?.id);
        updateFeed(ctx, newFeed);
      }
    },
    'syncFeed',
  );

  function updateFeed(ctx: Ctx, newFeedId: string | null) {
    const currentFeed = ctx.get(currentEventFeedAtom);
    if (currentFeed?.id !== newFeedId) {
      currentEventFeedAtom(ctx, newFeedId ? { id: newFeedId } : null);
      // deselect current event
      currentEventAtom(ctx, { id: null });
      scheduledAutoSelect(ctx, false);
    }
  }

  function checkFeed(eventFeeds: EventFeedConfig[], feedId?: string) {
    if (!feedId) return configRepo.get().defaultFeed;
    const feed = eventFeeds?.find((fd) => fd.feed === feedId);
    return feed ? feed.feed : configRepo.get().defaultFeed;
  }

  // v3 exports object
  return {
    currentEventFeedAtom,
    setCurrentFeed,
    setFeedForExistingEvent,
    resetCurrentFeed,
    syncFeed,
  };
}

const v3 = __create_v3();
// v3 exports as default
export default v3;

// v2 compatible exports keeping the same names
export const currentEventFeedAtom = v3toV2(v3.currentEventFeedAtom, {
  setCurrentFeed: v3.setCurrentFeed,
  setFeedForExistingEvent: v3.setFeedForExistingEvent,
  resetCurrentFeed: v3.resetCurrentFeed,
  syncFeed: v3.syncFeed,
});
