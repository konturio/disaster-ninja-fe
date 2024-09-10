import s from './Article.module.css';
import type { PropsWithChildren } from 'react';

export function Article({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={s.mainWrap}>
      <article className={`${s.content} ${className}`}>{children}</article>
    </div>
  );
}
