import { Disasters24 } from '@konturio/default-icons';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { useAtom as useAtomV3 } from '@reatom/npm-react';
import clsx from 'clsx';
import { useCallback, useMemo, useRef } from 'react';
import { Sheet } from 'react-modal-sheet';
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
import { MIN_HEIGHT } from '../../constants';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { EventCard } from '../EventCard/EventCard';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import { EventsPanelErrorMessage } from '../EventsPanelErrorMessage/EventsPanelErrorMessage';
import s from './EventsPanel.module.css';
import type { Event } from '~core/types';
import type { SheetRef } from 'react-modal-sheet';

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
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  const {
    panelState,
    panelControls,
    openFullState,
    closePanel,
    togglePanel,
    isOpen,
    isShort,
  } = useShortPanelState({ isMobile });

  const [focusedGeometry] = useAtom(focusedGeometryAtom);
  const [{ data: eventsList, error, loading }] = useAtomV3(sortedEventListAtom);
  const sheetRef = useRef<SheetRef>(null);

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

  const panelContent = useCallback(
    (state: typeof panelState) => {
      if (state === 'closed') return null;
      if (loading)
        return <LoadingSpinner message={i18n.t('loading_events')} marginTop="none" />;
      if (error) return <EventsPanelErrorMessage state={state} message={error} />;

      return state === 'full' ? (
        <FullState
          eventsList={eventsList}
          currentEventId={currentEventId ?? null}
          renderEventCard={renderEventCard}
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

  const panel = (
    <Panel
      header={header}
      headerIcon={
        <div className={s.iconWrap}>
          <Disasters24 />
        </div>
      }
      onHeaderClick={togglePanel}
      className={clsx(s.eventsPanel, isOpen ? s.show : s.collapse, 'knt-panel')}
      classes={panelClasses}
      isOpen={isOpen}
      resize={isMobile || isShort ? 'none' : 'vertical'}
      contentClassName={s.contentWrap}
      contentContainerRef={handleRefChange}
      customControls={panelControls}
      contentHeight={isShort ? 'min-content' : undefined}
      minContentHeight={isShort ? 'min-content' : MIN_HEIGHT}
    >
      {panelContent(panelState)}
    </Panel>
  );

  return (
    <>
      {isMobile ? (
        <Sheet
          ref={sheetRef}
          isOpen={isOpen}
          onClose={closePanel}
          initialSnap={1}
          snapPoints={[1, 0.5]}
          detent="full-height"
        >
          <Sheet.Backdrop onTap={closePanel} className={s.backdrop} />
          <Sheet.Container>
            <Sheet.Content style={{ paddingBottom: sheetRef.current?.y }}>
              {panel}
            </Sheet.Content>
          </Sheet.Container>
        </Sheet>
      ) : (
        panel
      )}

      <PanelIcon
        clickHandler={openFullState}
        className={clsx(s.panelIcon, isMobile ? s.mobile : s.desktop, 'knt-panel-icon')}
        icon={<Disasters24 />}
      />
    </>
  );
}
