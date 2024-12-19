import { Disasters24 } from '@konturio/default-icons';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { useAction, useAtom as useAtomV3 } from '@reatom/npm-react';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { panelClasses } from '~components/Panel';
import { AppFeature } from '~core/app/types';
import { configRepo } from '~core/config';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { getEventName, isEventGeometry } from '~core/focused_geometry/utils';
import { i18n } from '~core/localization';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { sortedEventListAtom } from '~features/events_list/atoms/sortedEventList';
import { setEventSortingOrder } from '~features/events_list/atoms/eventSortingConfig';
import { MIN_HEIGHT } from '../../constants';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import s from './EventsPanel.module.css';
import type { Event } from '~core/types';

const featureFlags = configRepo.get().features;
const hasTimeline = !!featureFlags[AppFeature.EPISODES_TIMELINE];

function findEventById(eventsList: Event[] | null, eventId?: string | null) {
  if (!eventId || !eventsList?.length) return null;
  return eventsList.find((event) => event.eventId === eventId);
}

function shouldShowTimeline(event: Event, hasTimeline: boolean): boolean {
  return hasTimeline && event.episodeCount > 1;
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
  const [{ data: eventsList, error, loading }] = useAtomV3(sortedEventListAtom);
  const setSortingOrder = useAction(setEventSortingOrder);

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

  const handleSort = useCallback(
    (order: 'asc' | 'desc') => {
      setSortingOrder(order);
    },
    [setSortingOrder],
  );

  const panelContent = useCallback(
    (state: typeof panelState) => {
      if (state === 'closed') return null;
      if (loading)
        return <LoadingSpinner message={i18n.t('loading_events')} marginTop="none" />;
      if (error) return <ErrorMessage message={error} />;

      return state === 'full' ? (
        <FullState
          eventsList={eventsList}
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
      eventsList,
      currentEventId,
      renderEventCard,
      handleSort,
      openFullState,
      currentEvent,
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
