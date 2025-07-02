import clsx from 'clsx';
import { useFormattedValue } from '../hooks/useFormattedValue';
import bs from './Base.module.css';

export interface TextProps {
  value: string;
  className?: string;
  format?: string;
}

export interface TitleProps extends TextProps {
  level?: number;
}

export function Title({ value, className, level = 2, format }: TitleProps) {
  return (
    <Text
      value={value}
      className={clsx(bs.titleL2, clsx(bs[`titleL${level}`]), className)}
      format={format}
    />
  );
}
export function Text({ value, className, format }: TextProps) {
  const formattedValue = useFormattedValue(value, format);

  return <div className={clsx(bs.text, className)}>{formattedValue}</div>;
}
