import s from './Article.module.css';
import type { PropsWithChildren } from 'react';

export function Article({
  children,
  className = '',
  id = '',
}: PropsWithChildren<{ className?: string; id?: string }>) {
  return (
    <article className={`${s.article} ${className}`} id={id}>
      {children}
    </article>
  );
}
