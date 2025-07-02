import clsx from 'clsx';
import bs from './Base.module.css';

export interface TextProps {
  value: string;
  className?: string;
}

export interface TitleProps extends TextProps {
  level?: number;
}

export function Title({ value, className, level = 2 }: TitleProps) {
  return (
    <div className={clsx(bs.titleL2, clsx(bs[`titleL${level}`]), className)}>{value}</div>
  );
}
export function Text({ value, className }: TextProps) {
  return <div className={clsx(bs.text, className)}>{value}</div>;
}
