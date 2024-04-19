import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import usePromise from 'react-promise-suspense';
import { Article } from '~components/Layout';
import { goTo } from '~core/router/goTo';
import { getAsset } from '~core/api/assets';

type PagesDocumentElement = {
  type: 'css' | 'md';
  url?: string;
  data?: string;
};

const PagesDocumentElementRenderers = {
  css: CssElement,
  md: MarkdownElement,
};

const fetchPagesDocument = (doc) =>
  Promise.all(
    doc.map((element) => {
      if (element.url) {
        return getAsset(element.url).then((res) => {
          return { ...element, data: res };
        });
      } else return element;
    }),
  );

export function PagesDocument({ doc }: { doc: PagesDocumentElement[] }) {
  const data = usePromise(fetchPagesDocument, [doc]);
  return <PagesDocumentRenderer doc={data} />;
}

export function PagesDocumentRenderer({ doc }: { doc: PagesDocumentElement[] }) {
  return (
    <Article>
      {doc.map((e, idx) => {
        if (PagesDocumentElementRenderers.hasOwnProperty(e.type)) {
          const Component = PagesDocumentElementRenderers[e.type];
          return <Component key={idx} data={e.data ?? ''} />;
        }
      })}
    </Article>
  );
}

type PagesDocumentElementProps = { data: string };

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[gfm]}
      components={{
        a(props) {
          const { node, ...rest } = props;
          const href = (node?.properties?.href ?? '') as string;
          const isExternalLink =
            href.startsWith('http://') || href.startsWith('https://');
          if (isExternalLink) {
            // open external links in new window
            return <a {...rest} target="_blank" rel="noreferrer" className="external" />;
          }
          // internal link - use router
          return (
            <a
              {...rest}
              onClick={(e) => {
                goTo(href);
                e.preventDefault();
              }}
              className="internal"
            />
          );
        },
      }}
    >
      {data}
    </ReactMarkdown>
  );
}
