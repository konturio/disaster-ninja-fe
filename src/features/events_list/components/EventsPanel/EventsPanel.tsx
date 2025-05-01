import { Disasters24 } from '@konturio/default-icons';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { useAtom as useAtomV3 } from '@reatom/npm-react';
import clsx from 'clsx';
import { useCallback, useMemo, useRef } from 'react';
import { Sheet } from 'react-modal-sheet';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { panelClasses } from '~components/Panel';
import {
  UniLayoutContext,
  useUniLayoutContextValue,
} from '~components/Uni/Layout/UniLayoutContext';
import { UniLayoutRenderer } from '~components/Uni/Layout/UniLayoutRenderer';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { getEventName, isEventGeometry } from '~core/focused_geometry/utils';
import { i18n } from '~core/localization';
import { useAutoCollapsePanel } from '~utils/hooks/useAutoCollapsePanel';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { useHeightResizer } from '~utils/hooks/useResizer';
import { useShortPanelState } from '~utils/hooks/useShortPanelState';
import { sortedEventListAtom } from '~features/events_list/atoms/sortedEventList';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { MIN_HEIGHT } from '../../constants';
import { FullState } from '../FullState/FullState';
import { ShortState } from '../ShortState/ShortState';
import { EventsPanelErrorMessage } from '../EventsPanelErrorMessage/EventsPanelErrorMessage';
import { eventCardLayoutTemplate } from './eventLayouts';
import s from './EventsPanel.module.css';
import type { Event } from '~core/types';
import type { SheetRef } from 'react-modal-sheet';

const hasTimeline = !!configRepo.get().features[AppFeature.EPISODES_TIMELINE];

function findEventById(eventsList: Event[] | null, eventId?: string | null) {
  if (!eventId || !eventsList?.length) return null;
  return eventsList.find((event) => event.eventId === eventId);
}

const renderEventCard = (event: Event, isActive: boolean) => {
  const data = {
    ...event,
    active: isActive,
    // only on active card
    showEpisodesButton: isActive && hasTimeline && event.episodeCount > 1,
  };
  return <UniLayoutRenderer node={eventCardLayoutTemplate} data={data} />;
};

export function EventsPanel({
  currentEventId,
  actionHandler,
}: {
  currentEventId?: string | null;
  actionHandler: (action: string, data?: { eventId: string }) => void;
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

  // Create a shared layout context for all event cards
  const layoutContextValue = useUniLayoutContextValue({
    layout: eventCardLayoutTemplate,
    actionHandler,
  });

  const panelContent = useCallback(
    (state: typeof panelState) => {
      if (state === 'closed') return null;
      if (loading)
        return <LoadingSpinner message={i18n.t('loading_events')} marginTop="none" />;
      if (error) return <EventsPanelErrorMessage state={state} message={error} />;

      // Wrap the entire panel content with a shared layout context
      return (
        <UniLayoutContext.Provider value={layoutContextValue}>
          {state === 'full' ? (
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
          )}
        </UniLayoutContext.Provider>
      );
    },
    [
      layoutContextValue,
      loading,
      error,
      eventsList,
      currentEventId,
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
