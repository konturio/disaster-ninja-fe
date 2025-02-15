import s from './Title.module.css';

export interface TitleProps {
  value: string;
  icon?: string;
  subtitle?: string;
}

export function Title({ value, icon, subtitle }: TitleProps) {
  return (
    <div className={s.title}>
      {icon && <img src={icon} alt={value} />}
      <div>{value}</div>
      {subtitle && <div className={s.sub}>{subtitle}</div>}
    </div>
  );
}
