import s from './CardText.module.css';

export interface CardTextProps {
  value: string;
  title?: string;
}

export function CardText({ value, title }: CardTextProps) {
  return (
    <div>
      {title && <div className={s.title}>{title}</div>}
      <div className={s.text}>{value}</div>
    </div>
  );
}
