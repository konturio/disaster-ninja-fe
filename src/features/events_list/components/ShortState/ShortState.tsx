import { Button, Text } from '@konturio/ui-kit';
import { i18n } from '~core/localization';
import s from './ShortState.module.css';
import type { MouseEventHandler } from 'react';
import type { Event } from '~core/types';

const NoDisasterMessage = ({
  onOpenFullState,
}: {
  onOpenFullState: MouseEventHandler;
}) => (
  <div className={s.noDisasters}>
    <div className={s.noDisasterMsg}>
      <Text type="short-l">{i18n.t('event_list.no_selected_disaster')}</Text>
    </div>
    <div className={s.callToAction}>
      <Button
        variant="invert"
        size="small"
        onClick={onOpenFullState}
        className="knt-panel-button"
      >
        <Text type="short-m">{i18n.t('event_list.chose_disaster')}</Text>
      </Button>
    </div>
  </div>
);

export function ShortState({
  openFullState,
  currentEvent,
  renderEventCard,
}: {
  openFullState: MouseEventHandler;
  currentEvent: Event | null;
  renderEventCard: (event: Event, isActive: boolean) => JSX.Element;
}) {
  if (!currentEvent) return <NoDisasterMessage onOpenFullState={openFullState} />;
  return <div className={s.shortPanel}>{renderEventCard(currentEvent, true)}</div>;
}
