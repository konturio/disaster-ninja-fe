import Markdown from 'markdown-to-jsx';
import usePromise from 'react-promise-suspense';
import { goTo } from '~core/router/goTo';
import { getAsset } from '~core/api/assets';
import { Article } from '~components/Layout';

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

export function PagesDocument({
  doc,
  wrapperComponent,
}: {
  doc: PagesDocumentElement[];
  wrapperComponent?;
}) {
  const data = usePromise(fetchPagesDocument, [doc]);
  return <PagesDocumentRenderer doc={data} wrapperComponent={wrapperComponent} />;
}

export function PagesDocumentRenderer({
  doc,
  wrapperComponent,
}: {
  doc: PagesDocumentElement[];
  wrapperComponent;
}) {
  const WrapperComponent = wrapperComponent ? wrapperComponent : Article;
  return (
    <WrapperComponent>
      {doc.map((e, idx) => {
        if (PagesDocumentElementRenderers.hasOwnProperty(e.type)) {
          const Component = PagesDocumentElementRenderers[e.type];
          return <Component key={idx} data={e.data ?? ''} />;
        }
      })}
    </WrapperComponent>
  );
}

type PagesDocumentElementProps = { data: string };

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  return (
    <Markdown
      options={{
        overrides: {
          a: CustomLink,
        },
      }}
    >
      {data}
    </Markdown>
  );
}

function CustomLink({ children, ...props }) {
  const {
    // className,
    href,
    title,
  } = props;
  const isExternalLink = href.startsWith('http://') || href.startsWith('https://');
  if (isExternalLink) {
    // open external links in new window
    return (
      <a title={title} href={href} target="_blank" rel="noreferrer" className="external">
        {children}
      </a>
    );
  }
  // internal link - use router
  return (
    <a
      title={title}
      href={href}
      onClick={(e) => {
        goTo(href);
        e.preventDefault();
      }}
      className="internal"
    >
      {children}
    </a>
  );
}
