import { Virtuoso } from 'react-virtuoso';
import { TranslationService as i18n } from '~core/localization';
import { Event } from '~appModule/types';
import { Panel, Text } from '@k2-packages/ui-kit';
import { EventCard } from '../EventCard/EventCard';
import { createStateMap } from '~utils/atoms/createStateMap';
import s from './EventsListPanel.module.css';
import { LoadingSpinner } from '~components/LoadingSpinner/LoadingSpinner';
import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';

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
  const statesToComponents = createStateMap({
    error,
    loading,
    data: eventsList,
  });

  return (
    <Panel
      header={<Text type="heading-l">{i18n.t('Ongoing disasters')}</Text>}
      className={s.sidePannel}
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
            />
          ),
        })}
      </div>
    </Panel>
  );
}
