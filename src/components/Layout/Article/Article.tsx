import s from './Article.module.css';
import type { PropsWithChildren } from 'react';

export function Article({
  children,
  className = '',
  id = '',
}: PropsWithChildren<{ className?: string; id?: string }>) {
  return (
    <div className={s.mainWrap} id={id}>
      <article className={`${s.content} ${className}`}>{children}</article>
    </div>
  );
}
