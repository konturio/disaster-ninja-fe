import bs from './Base.module.css';

export interface TextProps {
  value: string;
}
export function Title({ value }: TextProps) {
  return <div className={bs.titleText}>{value}</div>;
}
export function Text({ value }: TextProps) {
  return <div className={bs.text}>{value}</div>;
}
