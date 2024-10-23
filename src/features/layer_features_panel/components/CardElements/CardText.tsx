import s from './CardText.module.css';

export interface CardTextProps {
  text: string;
  title?: string;
}

export function CardText({ text, title }: CardTextProps) {
  return (
    <div>
      {title && <div className={s.title}>{title}</div>}
      <div className={s.text}>{text}</div>
    </div>
  );
}
