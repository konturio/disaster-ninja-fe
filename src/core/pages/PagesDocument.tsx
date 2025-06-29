import usePromise from 'react-promise-suspense';
import { Article } from '~components/Layout';
import { getAsset } from '~core/api/assets';
import { StructuredMarkdownContent } from './StructuredMarkdownContent';
import './pages.css';

type PagesDocumentElement = {
  type: 'css' | 'md';
  url?: string;
  data?: string;
};

type ResolvedPagesDocumentElement = PagesDocumentElement & { data: string };

const PagesDocumentElementRenderers = {
  css: CssElement,
  md: MarkdownElement,
};

function fetchPagesDocument(
  doc: PagesDocumentElement[],
): Promise<ResolvedPagesDocumentElement[]> {
  return Promise.all(
    doc.map(async (element) => {
      if (element.url) {
        try {
          const res = await getAsset(element.url);
          return { ...element, data: res as string };
        } catch (error) {
          console.error(`Failed to load asset from ${element.url}:`, error);
        }
      }
      return { ...element, data: element.data || '' };
    }),
  );
}

type PagesDocumentProps = {
  doc: PagesDocumentElement[];
  wrapperComponent?: React.ComponentType<{ id: string; children?: React.ReactNode }>;
  id: string;
};

type PagesDocumentElementProps = {
  data: string;
};

function CssElement({ data }: PagesDocumentElementProps) {
  return <style>{data}</style>;
}

function MarkdownElement({ data }: PagesDocumentElementProps) {
  // We use a global CSS class instead of CSS modules here to allow users to override styles
  // through their own stylesheets. See pages.css for the default styling
  return (
    <div className="app-pages-element-markdown">
      <StructuredMarkdownContent content={data} />
    </div>
  );
}

export function PagesDocument({
  doc,
  wrapperComponent: Wrapper = Article,
  id,
}: PagesDocumentProps) {
  const data = usePromise(fetchPagesDocument, [doc]);

  return (
    <Wrapper id={`app-pages-docid-${id}`}>
      {data.map((element, index) => {
        const Renderer = PagesDocumentElementRenderers[element.type];
        return <Renderer key={index} {...element} />;
      })}
    </Wrapper>
  );
}

export type { PagesDocumentElement, PagesDocumentProps };
