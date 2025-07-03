import clsx from 'clsx';
import { applyValueToTemplate } from '../helpers/applyValueToTemplate';
import s from './Image.module.css';

export interface ImageProps {
  value?: string;
  className?: string;
  urlTemplate?: string;
}

export function Image({ value, className, urlTemplate }: ImageProps) {
  const url = urlTemplate ? applyValueToTemplate(urlTemplate, value) : value;

  return (
    <div className={clsx(s.imageContainer, className)}>
      <img src={url} className={s.image}></img>
    </div>
  );
}
