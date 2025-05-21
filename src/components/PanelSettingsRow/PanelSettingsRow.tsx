import s from './PanelSettingsRow.module.css';

export function PanelSettingsRow({
  children,
}: React.PropsWithChildren<Record<string, unknown>>) {
  return <div className={s.panelSettingsRow}>{children}</div>;
}
