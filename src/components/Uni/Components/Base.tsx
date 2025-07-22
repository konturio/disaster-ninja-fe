import clsx from 'clsx';
import { useUniLayoutContext } from '../Layout/UniLayoutContext';
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
  const context = useUniLayoutContext();
  const formattedValue = context.getFormattedValue(value, format);

  return (
    <div className={clsx(level ? bs[`titleL${level}`] : bs.titleL2, className)}>
      {formattedValue}
    </div>
  );
}
export function Text({ value, className, format }: TextProps) {
  const context = useUniLayoutContext();
  const formattedValue = context.getFormattedValue(value, format);

  return <div className={clsx(bs.text, className)}>{formattedValue}</div>;
}
