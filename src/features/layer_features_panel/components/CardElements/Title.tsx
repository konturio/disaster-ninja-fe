import s from './Title.module.css';

export interface TitleProps {
  icon?: string;
  title: string;
  subtitle?: string;
}

export function Title({ icon, title, subtitle }: TitleProps) {
  return (
    <div className={s.title}>
      {icon && <img src={icon} alt={title} />}
      <div>{title}</div>
      {subtitle && <div className={s.sub}>{subtitle}</div>}
    </div>
  );
}
