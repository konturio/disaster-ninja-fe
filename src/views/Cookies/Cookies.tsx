import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import cookiesTable from './cookies.en.md?raw';
import s from './Cookies.module.css';

export function CookiesPage() {
  return (
    <div className={s.mainWrap}>
      <article className={s.content}>
        <ReactMarkdown remarkPlugins={[gfm]} className={s.markdown}>
          {cookiesTable}
        </ReactMarkdown>
      </article>
    </div>
  );
}
