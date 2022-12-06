import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import { Article } from '~components/Layout';
import cookiesTable from './cookies.en.md?raw';

export function CookiesPage() {
  return (
    <Article>
      <ReactMarkdown remarkPlugins={[gfm]}>{cookiesTable}</ReactMarkdown>
    </Article>
  );
}
