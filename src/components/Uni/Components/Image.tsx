import clsx from 'clsx';
import { applyValueToTemplate } from '../helpers/applyValueToTemplate';
import s from './Image.module.css';
import type { CSSProperties } from 'react';

export interface ImageProps {
  value?: string;
  className?: string;
  urlTemplate?: string;
  style?: CSSProperties;
}

export function Image({ value, className, urlTemplate, style }: ImageProps) {
  const url = urlTemplate ? applyValueToTemplate(urlTemplate, value) : value;

  return (
    <div className={clsx(s.imageContainer, className)} style={style}>
      <img src={url} className={s.image}></img>
    </div>
  );
}
