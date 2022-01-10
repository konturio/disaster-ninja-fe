import { Virtuoso } from 'react-virtuoso';
import { TranslationService as i18n } from '~core/localization';
import { Event } from '~core/types';
import { Panel, Text } from '@k2-packages/ui-kit';
import { EventCard } from '../EventCard/EventCard';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './EventsListPanel.module.css';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from '@reatom/react';
import { sideControlsBarAtom } from '~core/shared_state';
import clsx from 'clsx';
import {
  EVENTLIST_CONROL_ID,
  EVENTLIST_CONROL_NAME,
} from '~features/events_list/constants';
import eventsIcon from '~features/events_list/icons/eventsIcon.svg';
import { controlVisualGroup } from '~core/shared_state/sideControlsBar';

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
  const [, { enable, disable, addControl, toggleActiveState }] =
    useAtom(sideControlsBarAtom);

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const virtuoso = useRef(null);

  useEffect(() => {
    // type any is used because virtuoso types doesnt have scrollToIndex method, but it's described in docs https://virtuoso.dev/scroll-to-index
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

  const onPanelClose = useCallback(() => {
    setIsOpen(false);
    disable(EVENTLIST_CONROL_ID);
  }, [setIsOpen]);

  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  useEffect(() => {
    addControl({
      id: EVENTLIST_CONROL_ID,
      name: EVENTLIST_CONROL_NAME,
      active: false,
      visualGroup: controlVisualGroup.withAnalitics,
      icon: <img src={eventsIcon} alt={i18n.t('Event list')} />,
      onClick: (becomesActive) => {
        toggleActiveState(EVENTLIST_CONROL_ID);
      },
      onChange: (isActive) => {
        setIsOpen(isActive);
      },
    });

    enable(EVENTLIST_CONROL_ID);
    return () => {
      disable(EVENTLIST_CONROL_ID);
    };
  }, []);

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Ongoing disasters')}</Text>}
      className={clsx(s.sidePannel, isOpen && s.show, !isOpen && s.hide)}
      onClose={onPanelClose}
    >
      <div className={s.scrollable}>
        {statesToComponents({
          loading: <LoadingSpinner />,
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
    </Panel>
  );
}
