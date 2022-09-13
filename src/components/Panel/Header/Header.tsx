import { Text } from '@konturio/ui-kit';
import s from './Header.module.css';

export function PanelHeader({ icon, title }: { icon: JSX.Element; title: string }) {
  return (
    <div className={s.headerTitle}>
      {icon}
      <Text type="heading-l">{title}</Text>
    </div>
  );
}
