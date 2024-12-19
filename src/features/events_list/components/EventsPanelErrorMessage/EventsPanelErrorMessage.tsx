import { ErrorMessage } from '~components/ErrorMessage/ErrorMessage';
import { EventsPanelSettings } from '../EventsPanelSettings/EventsPanelSettings';
import s from './EventsPanelErrorMessage.module.css';
import type { PanelState } from '~utils/hooks/useShortPanelState';

export function EventsPanelErrorMessage({
  message,
  state,
}: {
  message: string;
  state: Exclude<PanelState, 'closed'>;
}) {
  if (state === 'short') {
    return <ErrorMessage message={message} />;
  }
  return (
    <div className={s.container}>
      <EventsPanelSettings />
      <ErrorMessage message={message} />
    </div>
  );
}
