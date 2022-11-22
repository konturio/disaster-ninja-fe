import { Virtuoso } from 'react-virtuoso';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import { i18n } from '~core/localization';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { panelClasses } from '~components/Panel';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { FeedSelector } from '../FeedSelector/FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
import { MIN_HEIGHT } from '../../constants';
import { ShortPanel } from '../ShortPanel/ShortPanel';
import s from './EventsListPanel.module.css';
import type { ShortStateListenersType } from '@konturio/ui-kit/tslib/Panel';
import type { Event } from '~core/types';

export function EventsListPanel({
  current,
  onCurrentChange,
  error,
  loading,
  eventsList,
}: {
  current: string | null;
  onCurrentChange: (id: string) => void;
  error: string | null;
  loading: boolean;
  eventsList: Event[] | null;
}) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isShortStateOpen, setIsShortStateOpen] = useState(false);

  const shortStateListeners: ShortStateListenersType = {
    onClose: () => {
      setIsOpen(false);
      setIsShortStateOpen(false);
    },
    onFullStateOpen: () => {
      setIsOpen(true);
      setIsShortStateOpen(false);
    },
    onShortStateOpen: () => {
      setIsOpen(true);
      setIsShortStateOpen(true);
    },
  };

  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const virtuoso = useRef(null);
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const handleRefChange = useHeightResizer(setIsOpen, isOpen, MIN_HEIGHT);

  const togglePanel = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, [setIsOpen]);

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  // Virtual event list rendering effect
  useEffect(() => {
    // type any is used because virtuoso types doesn't have scrollToIndex method, but it's described in docs https://virtuoso.dev/scroll-to-index
    const ref: any = virtuoso.current;
    if (ref && current && eventsList?.length) {
      const currentEventIndex = eventsList.findIndex(
        (event) => event.eventId === current,
      );
      // behavior: 'smooth' breaks this method as documentation warns https://virtuoso.dev/scroll-to-index
      if (currentEventIndex > -1)
        ref.scrollToIndex({ index: currentEventIndex, align: 'center' });
    }
  }, [current, eventsList, virtuoso]);

  useAutoCollapsePanel(isOpen, onPanelClose);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  return (
    <div className={clsx(s.panelContainer, isShortStateOpen && s.short)}>
      <Panel
        header={String(i18n.t('disasters'))}
        headerIcon={<Disasters24 />}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        resize={isMobile || isShortStateOpen ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        shortStateContent={
          <ShortPanel
            hasTimeline={userModel?.hasFeature(AppFeature.EPISODES_TIMELINE)}
            openFullState={shortStateListeners.onFullStateOpen}
          />
        }
        shortStateListeners={shortStateListeners}
        isShortStateOpen={isShortStateOpen}
      >
        <div className={s.panelBody}>
          <EventListSettingsRow>
            <FeedSelector />
            <BBoxFilterToggle />
          </EventListSettingsRow>
          <div className={s.scrollable}>
            {statesToComponents({
              loading: <LoadingSpinner message={i18n.t('loading_events')} />,
              error: (errorMessage) => <ErrorMessage message={errorMessage} />,
              ready: (eventsList) => (
                <>
                  <Virtuoso
                    data={eventsList}
                    itemContent={(index, event) => (
                      <EventCard
                        key={event.eventId}
                        event={event}
                        isActive={event.eventId === current}
                        onClick={onCurrentChange}
                        alternativeActionControl={
                          userModel?.hasFeature(AppFeature.EPISODES_TIMELINE) ? (
                            <EpisodeTimelineToggle isActive={event.eventId === current} />
                          ) : null
                        }
                      />
                    )}
                    ref={virtuoso}
                  />
                  <div className={s.height100vh}>
                    {/* it helps expand panel to full height 
                    despite that virtual element has no height 
                    without braking scroll */}
                  </div>
                </>
              ),
            })}
          </div>
        </div>
      </Panel>

      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<Disasters24 />}
      />
    </div>
  );
}
