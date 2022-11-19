import { Virtuoso } from 'react-virtuoso';
import { Panel, PanelIcon } from '@konturio/ui-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import core from '~core/index';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { panelClasses } from '~components/Panel';
import {
  useAutoCollapsePanel,
  useSmartColumnContentResizer,
} from '~components/SmartColumn';
import { FeedSelector } from '../FeedSelector/FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
import { MIN_HEIGHT } from '../../constants';
import s from './EventsListPanel.module.css';
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
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const virtuoso = useRef(null);
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const contentRef = useSmartColumnContentResizer(setIsOpen, isOpen, MIN_HEIGHT);

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
    <div className={clsx(s.panelContainer, isOpen && s.open)}>
      <Panel
        header={core.i18n.t('disasters')}
        headerIcon={<Disasters24 />}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        onHeaderClick={togglePanel}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: onPanelClose, showInModal: isMobile }}
        minContentHeightPx={MIN_HEIGHT}
        resize={isMobile ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={contentRef}
      >
        <div className={s.panelBody}>
          <EventListSettingsRow>
            <FeedSelector />
            <BBoxFilterToggle />
          </EventListSettingsRow>
          <div className={s.scrollable}>
            {statesToComponents({
              loading: <LoadingSpinner message={core.i18n.t('loading_events')} />,
              error: (errorMessage) => <ErrorMessage message={errorMessage} />,
              ready: (eventsList) => (
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
