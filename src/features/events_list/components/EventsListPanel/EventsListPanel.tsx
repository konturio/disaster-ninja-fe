import { Virtuoso } from 'react-virtuoso';
import { Panel } from '@konturio/ui-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { useAtom } from '@reatom/react';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { createStateMap } from '~utils/atoms/createStateMap';
import { i18n } from '~core/localization';
import { toolbarControlsAtom } from '~core/shared_state';
import {
  EVENT_LIST_CONTROL_ID,
  EVENT_LIST_CONTROL_NAME,
} from '~features/events_list/constants';
import { controlVisualGroup } from '~core/shared_state/toolbarControls';
import { PanelWrap } from '~components/Panel/Wrap/PanelWrap';
import { PanelHeader } from '~components/Panel/Header/Header';
import { userResourceAtom } from '~core/auth';
import { AppFeature } from '~core/auth/types';
import { FeedSelector } from '../FeedSelector/FeedSelector';
import { EpisodeTimelineToggle } from '../EpisodeTimelineToggle/EpisodeTimelineToggle';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
import s from './EventsListPanel.module.css';
import type { Event } from '~core/types';

const classes = { header: s.header };
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
  const virtuoso = useRef(null);
  // TEMP files. Remove when #11729 or #11710 will be implemented
  const [wasClosed, setWasClosed] = useState<null | boolean>(null);
  const [, { enable, disable, addControl, toggleActiveState }] =
    useAtom(toolbarControlsAtom);
  const [{ data: userModel }] = useAtom(userResourceAtom);

  const onPanelClose = useCallback(() => {
    disable(EVENT_LIST_CONTROL_ID);
  }, [setIsOpen]);

  useEffect(() => {
    addControl({
      id: EVENT_LIST_CONTROL_ID,
      name: EVENT_LIST_CONTROL_NAME,
      title: i18n.t('event_list.title'),
      active: true,
      visualGroup: controlVisualGroup.withAnalytics,
      icon: <Disasters24 />,
      onClick: (becomesActive) => {
        toggleActiveState(EVENT_LIST_CONTROL_ID);
      },
      onChange: (isActive) => {
        setIsOpen(isActive);
        setWasClosed((wasPreviouslyClosed) => {
          if (wasPreviouslyClosed === null) return false;
          return !isActive;
        });
      },
    });

    return () => {
      disable(EVENT_LIST_CONTROL_ID);
    };
  }, []);

  // RESTORE when #11729 or #11710 will be implemented
  /*useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile, setIsOpen]);

  
  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  */

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

  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  return (
    <div className={s.eventsPanelComponent}>
      <PanelWrap onPanelClose={onPanelClose} isPanelOpen={isOpen}>
        <Panel
          header={<PanelHeader icon={<Disasters24 />} title={i18n.t('disasters')} />}
          className={clsx(s.eventsPanel, isOpen && s.show, !isOpen && s.hide)}
          onClose={onPanelClose}
          classes={classes}
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
      </PanelWrap>

      {/* RESTORE  #11729 
      <PanelIcon
        clickHandler={onPanelOpen}
        className={clsx(s.panelIcon, isOpen && s.hide, !isOpen && s.show)}
        icon={<Disasters24 />}
      /> */}
    </div>
  );
}
