import { Virtuoso } from 'react-virtuoso';
import { Panel, PanelIcon, Text } from '@konturio/ui-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Disasters24 } from '@konturio/default-icons';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { IS_MOBILE_QUERY, useMediaQuery } from '~utils/hooks/useMediaQuery';
import { createStateMap } from '~utils/atoms/createStateMap';
import { i18n } from '~core/localization';
import { FeedSelector } from '../FeedSelector/FeedSelector';
import { BBoxFilterToggle } from '../BBoxFilterToggle/BBoxFilterToggle';
import { EventListSettingsRow } from '../EventListSettingsRow/EventListSettingsRow';
import { EventCard } from '../EventCard/EventCard';
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
  const virtuoso = useRef(null);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);

  useEffect(() => {
    if (isMobile) {
      // TODO
    }
  }, [isMobile]);

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

  const onPanelOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  return (
    <>
      <Panel
        header={isOpen ? <Text type="heading-l">{i18n.t('disasters')}</Text> : undefined}
        className={clsx(s.sidePanel, isOpen && s.show, !isOpen && s.hide)}
        onClose={onPanelClose}
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
    </>
  );
}
