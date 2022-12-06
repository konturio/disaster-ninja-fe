import s from './Article.module.css';
import type { PropsWithChildren } from 'react';

export function Article({ children }: PropsWithChildren) {
  return (
    <div className={s.mainWrap}>
      <article className={s.content}>{children}</article>
    </div>
  );
}
