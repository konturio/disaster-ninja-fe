import clsx from 'clsx';
import bs from './Base.module.css';

export interface TextProps {
  value: string;
  className?: string;
}
export function Title({ value, className }: TextProps) {
  return <div className={clsx(bs.titleText, className)}>{value}</div>;
}
export function Text({ value, className }: TextProps) {
  return <div className={clsx(bs.text, className)}>{value}</div>;
}
