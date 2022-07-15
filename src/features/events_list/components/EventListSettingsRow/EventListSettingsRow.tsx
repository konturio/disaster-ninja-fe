import s from './EventListSettingsRow.module.css';

export function EventListSettingsRow({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) {
  return <div className={s.eventListSettingsRow}>{children}</div>;
}
