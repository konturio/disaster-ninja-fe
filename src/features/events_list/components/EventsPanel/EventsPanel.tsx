import { Disasters24 } from '@konturio/default-icons';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import clsx from 'clsx';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { panelClasses } from '~components/Panel';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { getEventName, isEventGeometry } from '~core/focused_geometry/utils';
import { i18n } from '~core/localization';
import { eventListResourceAtom } from '~features/events_list/atoms/eventListResource';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { MIN_HEIGHT } from '../../constants';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import s from './EventsPanel.module.css';
import type { Event } from '~core/types';

const featureFlags = configRepo.get().features;
const hasTimeline = !!featureFlags[AppFeature.EPISODES_TIMELINE];

const defaultEventsListConfig = {
  initialSort: undefined as 'asc' | 'desc' | undefined,
} as const;

type EventsListConfig = typeof defaultEventsListConfig;

const eventsListFeatureConfig: EventsListConfig = {
  ...defaultEventsListConfig,
  ...(typeof featureFlags[AppFeature.EVENTS_LIST] === 'object'
    ? (
        featureFlags[AppFeature.EVENTS_LIST] as {
          configuration?: Partial<EventsListConfig>;
        }
      ).configuration
    : {}),
};

function findEventById(eventsList: Event[] | null, eventId?: string | null) {
  if (!eventId || !eventsList?.length) return null;
  return eventsList.find((event) => event.eventId === eventId);
}

function shouldShowTimeline(event: Event, hasTimeline: boolean): boolean {
  return hasTimeline && event.episodeCount > 1;
}

function sortEventsByDate(events: Event[], order: 'asc' | 'desc'): Event[] {
  return [...events].sort((a, b) => {
    const dateA = new Date(a.updatedAt).getTime();
    const dateB = new Date(b.updatedAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

export function EventsPanel({
  currentEventId,
  onCurrentChange,
}: {
  currentEventId?: string | null;
  onCurrentChange: (id: string) => void;
}) {
  const {
    panelState,
    panelControls,
    openFullState,
    closePanel,
    togglePanel,
    isOpen,
    isShort,
  } = useShortPanelState();

  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(
    eventsListFeatureConfig.initialSort,
  );
  const [{ data: eventsList, error, loading }] = useAtom(eventListResourceAtom);

  const sortedEvents = useMemo(
    () =>
      eventsList && sortOrder ? sortEventsByDate(eventsList, sortOrder) : eventsList,
    [eventsList, sortOrder],
  );

  const handleRefChange = useHeightResizer(
    (isOpen) => !isOpen && closePanel(),
    isOpen,
    MIN_HEIGHT,
    'event_list',
  );

  useAutoCollapsePanel(isOpen, closePanel);

  const currentEvent = useMemo(
    () => findEventById(eventsList, currentEventId),
    [eventsList, currentEventId],
  );

  const handleEventClick = useCallback(
    (id: string) => {
      if (id !== currentEventId) {
        onCurrentChange(id);
      }
    },
    [currentEventId, onCurrentChange],
  );

  const renderEventCard = useCallback(
    (event: Event, isActive: boolean) => (
      <EventCard
        key={event.eventId}
        event={event}
        isActive={isActive}
        onClick={handleEventClick}
        alternativeActionControl={
          shouldShowTimeline(event, hasTimeline) ? (
            <EpisodeTimelineToggle isActive={isActive} />
          ) : null
        }
        externalUrls={event.externalUrls}
        showDescription={isActive}
      />
    ),
    [handleEventClick],
  );

  const handleSort = useCallback((order: 'asc' | 'desc') => {
    setSortOrder(order);
  }, []);

  const panelContent = useCallback(
    (state: typeof panelState) => {
      if (state === 'closed') return null;
      if (loading)
        return <LoadingSpinner message={i18n.t('loading_events')} marginTop="none" />;
      if (error) return <ErrorMessage message={error} />;

      return state === 'full' ? (
        <FullState
          eventsList={sortedEvents}
          currentEventId={currentEventId ?? null}
          renderEventCard={renderEventCard}
          onSort={handleSort}
        />
      ) : (
        <ShortState
          openFullState={openFullState}
          currentEvent={currentEvent ?? null}
          renderEventCard={renderEventCard}
        />
      );
    },
    [
      loading,
      error,
      sortedEvents,
      currentEventId,
      renderEventCard,
      openFullState,
      currentEvent,
      handleSort,
    ],
  );

  const header = isOpen ? (
    i18n.t('disasters')
  ) : (
    <div className={s.combinedHeader}>
      <div>{i18n.t('disasters')}</div>
      {isEventGeometry(focusedGeometry) && (
        <div className={clsx(s.eventNameLabel, s.truncated)}>
          <Text type="short-m">{getEventName(focusedGeometry)}</Text>
        </div>
      )}
    </div>
  );

  return (
    <>
      <Panel
        header={header}
        headerIcon={
          <div className={s.iconWrap}>
            <Disasters24 />
          </div>
        }
        onHeaderClick={togglePanel}
        className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse)}
        classes={panelClasses}
        isOpen={isOpen}
        modal={{ onModalClick: closePanel, showInModal: isMobile }}
        resize={isMobile || isShort ? 'none' : 'vertical'}
        contentClassName={s.contentWrap}
        contentContainerRef={handleRefChange}
        customControls={panelControls}
        contentHeight={isShort ? 'min-content' : undefined}
        minContentHeight={isShort ? 'min-content' : MIN_HEIGHT}
      >
        {panelContent(panelState)}
      </Panel>

      <PanelIcon
        clickHandler={openFullState}
        className={clsx(
          s.panelIcon,
          isOpen && s.hide,
          !isOpen && s.show,
          isMobile ? s.mobile : s.desktop,
        )}
        icon={<Disasters24 />}
      />
    </>
  );
}
